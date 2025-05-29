<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\BookingRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Booking;
use App\Repository\PropertyRepository;
use Symfony\Component\Serializer\SerializerInterface;
use App\Entity\Contract;
use App\Repository\ContractRepository;
use App\Entity\Notification;

#[Route('api/booking', name: 'app_booking')]
class BookingController extends AbstractController
{
    private BookingRepository $bookingRepository;
    
    private SerializerInterface $serializer;
    private PropertyRepository $propertyRepository;
    
    private EntityManagerInterface $entityManager;
    private ContractRepository $contractRepository;
    public function __construct(BookingRepository $bookingRepository, EntityManagerInterface $entityManager, PropertyRepository $propertyRepository, SerializerInterface $serializer,  ContractRepository $contractRepository 
    )
    
    
    {
        $this->bookingRepository = $bookingRepository;
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
        $this->contractRepository = $contractRepository;
        $this->propertyRepository = $propertyRepository;
    }

    
    
    public function index(): Response
    {
        return $this->render('booking/index.html.twig', [
            'controller_name' => 'BookingController',
        ]);
    }
    #[Route('/{id}/approval', name: 'approve_booking', methods: ['POST'])]
public function approveBooking(
    int $id,
    BookingRepository $bookingRepository,
   
    Request $request,
    EntityManagerInterface $em,
): JsonResponse {
    $data = json_decode($request->getContent(), true);
    $status = $data['approval']; // expected: 'approved' or 'rejected'

    if (!in_array($status, ['approved', 'rejected'])) {
        return $this->json(['error' => 'Invalid approval status'], 400);
    }
    $booking = $bookingRepository->find($id);

    $user = $this->getUser();
    $propertyOwner = $booking->getProperty()->getUser();

    if ($user !== $propertyOwner) {
        return $this->json(['error' => 'Unauthorized. You do not own this property.'], 403);
    }

    $booking->setApproval($status);
    $em->flush();
    if ($status === 'approved') {
        $contract = $this->contractRepository->createFromBooking($booking);
        $em->persist($contract);
        $em->flush();
    }
    $notification = new Notification();
    $notification->setUser($booking->getUser());
    $notification->setMessage("Your booking for property '{$booking->getProperty()->getGeneralinfo()->getTitle()}' has been {$status}.");
    $notification->setIsRead(false);
    $notification->setCreatedAt(new \DateTimeImmutable());

    $em->persist($notification);
    $em->flush();

    return $this->json(['message' => "Booking $status"]);
}
#[Route('/properties/{id}/book', name: 'book_property', methods: ['POST'])]
public function bookProperty(
    int $id,
    Request $request,
    EntityManagerInterface $em,
    \App\Repository\PropertyRepository $propertyRepository
): JsonResponse {
    $data = json_decode($request->getContent(), true);
    

    $property = $propertyRepository->find($id);
    if (!$property) {
        return $this->json(['error' => 'Property not found'], 404);
    }
    

    $booking = new Booking();
    $booking->setProperty($property);
    $booking->setUser($this->getUser());
    $booking->setStartDate(new \DateTime($data['startDate']));
    $booking->setEndDate(new \DateTime($data['endDate']));
    

    $em->persist($booking);
    $em->flush();
    $owner = $property->getUser();

    $notification = new Notification();
    $notification->setUser($owner);
    $notification->setMessage("You have a new booking request for your property: " . $property->getGeneralinfo()->getTitle());
    $notification->setIsRead(false);
    $notification->setCreatedAt(new \DateTimeImmutable());

    $em->persist($notification);
    $em->flush();


    return $this->json(['message' => 'Booking request submitted!'], 201);
}
#[Route('/my-bookings', name: 'my_bookings', methods: ['GET'])]
public function myBookings(BookingRepository $bookingRepository): JsonResponse
{
    $user = $this->getUser();
    $bookings = $bookingRepository->findBy(['user' => $user]);

    $data = array_map(function (Booking $booking) {
        return [
            'id' => $booking->getId(),
            'startDate' => $booking->getStartDate()->format('Y-m-d'),
            'endDate' => $booking->getEndDate()->format('Y-m-d'),
            'propertyId' => $booking->getProperty()->getId(),
            'status' => $booking->getApproval(),
            'popertyTitle' => $booking->getProperty()->getGeneralinfo()->getTitle(),
            'propertyCity' => $booking->getProperty()->getLocation()->getCity(),
            'propertysubcity'  => $booking->getProperty()->getLocation()->getSubcity(),

        ];
    }, $bookings);

    return $this->json($data);
}
#[Route('/owner/bookings', name: 'owner_bookings', methods: ['GET'])]
public function getBookingsForOwner(BookingRepository $bookingRepository): JsonResponse
{
    $owner = $this->getUser();
    $bookings = $bookingRepository->findBookingsByOwner($owner);

    $data = array_map(function (Booking $booking) {
        return [
            'id' => $booking->getId(),
            'startDate' => $booking->getStartDate()->format('Y-m-d'),
            'endDate' => $booking->getEndDate()->format('Y-m-d'),
            'propertyId' => $booking->getProperty()->getId(),
            'status' => $booking->getApproval(),
            'propertyTitle' => $booking->getProperty()->getGeneralinfo()->getTitle(),
            'propertyCity' => $booking->getProperty()->getLocation()->getCity(),
            'propertySubcity' => $booking->getProperty()->getLocation()->getSubcity(),
            'email' => $booking->getUser()->getEmail(), 
            'name' => $booking->getUser()->getFullName(), 
            'phone' => $booking->getUser()->getPhoneNumber(),
        ];
    }, $bookings);

    return $this->json($data);
}
#[Route('/notifications', name: 'get_notifications', methods: ['GET'])]
public function getNotifications(): JsonResponse
{
    $user = $this->getUser();
    $notifications = $this->entityManager->getRepository(Notification::class)->findBy(
        ['user' => $user],
        ['createdAt' => 'DESC']
    );

    $data = array_map(function (Notification $n) {
        return [
            'id' => $n->getId(),
            'message' => $n->getMessage(),
            'isRead' => $n->isIsRead(),
            'createdAt' => $n->getCreatedAt()->format('Y-m-d H:i'),
        ];
    }, $notifications);

    return $this->json($data);
}
#[Route('/notifications/{id}/read', name: 'mark_notification_read', methods: ['POST'])]
public function markNotificationRead(Notification $notification): JsonResponse
{
    $notification->setIsRead(true);
    $this->entityManager->flush();

    return $this->json(['message' => 'Notification marked as read']);
}

#[Route('/owner/new-booking-notifications', name: 'owner_new_booking_notifications', methods: ['GET'])]
public function getNewBookingNotifications(): JsonResponse
{
    $owner = $this->getUser();
    
    // Fetch all notifications related to this owner that are unread
    $notifications = $this->entityManager->getRepository(Notification::class)->findBy([
        'user' => $owner,
        'isRead' => false,
    ], ['createdAt' => 'DESC']);

    // Filter only booking-related notifications (optional: add a type field to Notification if needed)
    $data = array_map(function (Notification $notification) {
        return [
            'id' => $notification->getId(),
            'message' => $notification->getMessage(),
            'createdAt' => $notification->getCreatedAt()->format('Y-m-d H:i'),
        ];
    }, $notifications);

    return $this->json($data);
}



}
