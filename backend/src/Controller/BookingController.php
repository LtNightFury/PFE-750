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

#[Route('api/booking', name: 'app_booking')]
class BookingController extends AbstractController
{
    private BookingRepository $bookingRepository;
    
    private SerializerInterface $serializer;
    private PropertyRepository $propertyRepository;
    
    public function __construct(BookingRepository $bookingRepository, EntityManagerInterface $entityManager, \App\Repository\PropertyRepository $propertyRepository, SerializerInterface $serializer
    )
    
    {
        $this->bookingRepository = $bookingRepository;
      
        $this->serializer = $serializer;
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
        ];
    }, $bookings);

    return $this->json($data);
}

}
