<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Appointment;
use App\Entity\Property;

class AppointmentController extends AbstractController
{
       
    private $em;
    private $propertyRepository;

    public function __construct(\App\Repository\PropertyRepository $propertyRepository
    , EntityManagerInterface $em)
    {
        $this->propertyRepository = $propertyRepository;

        $this->em = $em;
        
    }
    #[Route('/api/appointments', name: 'app_appointment', methods: ['POST'])]
    public function createAppointment(Request $request): JsonResponse
    {

        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $id = $data['id'] ;
        $property = $this->propertyRepository->find($id);
        if (!$property) {
            return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
        }
        $appointment = new Appointment();
        $date = $data['appointmentDate'];
        $message = $data['message'];
        $appointmentTime = $data['appointmentTime'];

        $appointment->setUser($user);
        $appointment->setProperty($property);
        $appointment->setStatus('pending'); // Set the initial status to 'pending'
        $appointment->setAppointmentDate(new \DateTime($date));
        $appointment->setAppointmentTime(new \DateTime($appointmentTime));
        $appointment->setMessage($message);
   // Save the appointment to the database
        $this->em->persist($appointment);
        $this->em->flush();

        return new JsonResponse(['message' => 'Appointment created successfully'], Response::HTTP_CREATED);
    }
    #[Route('/api/properties/{propertyId}/available-slots', name: 'available_slots', methods: ['GET'])]
    public function getAvailableSlots(int $propertyId, Request $request): JsonResponse
    {
        $dateParam = $request->query->get('date'); // YYYY-MM-DD
    
        if (!$dateParam) {
            return new JsonResponse(['error' => 'Date query parameter is required'], Response::HTTP_BAD_REQUEST);
        }
    
        try {
            $date = new \DateTime($dateParam);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid date format'], Response::HTTP_BAD_REQUEST);
        }
    
        $property = $this->propertyRepository->find($propertyId);
        if (!$property) {
            return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
        }
    
        // Define all possible time slots (30-minute intervals from 09:00 to 17:00)
        $start = new \DateTime('09:00');
        $end = new \DateTime('17:00');
        $interval = new \DateInterval('PT30M');
        $allSlots = [];
    
        for ($time = clone $start; $time < $end; $time->add($interval)) {
            $allSlots[] = $time->format('H:i');
        }
    
        // Get booked slots from repository
        $bookedSlots = $this->em->getRepository(\App\Entity\Appointment::class)
                                ->getBookedSlotsForDate($propertyId, $date);
    
        $availableSlots = array_values(array_diff($allSlots, $bookedSlots));
    
        return new JsonResponse([
            'date' => $date->format('Y-m-d'),
            'availableSlots' => $availableSlots
        ]);
    }
   
   
   
   
   
   
   
   
   
    #[Route('/api/appointments/{id}/approve', name: 'approve_appointment', methods: ['PUT'])]
public function approveAppointment(int $id): JsonResponse
{
    $user = $this->getUser();

    if (!$user) {
        return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
    }

    $appointment = $this->em->getRepository(Appointment::class)->find($id);

    if (!$appointment) {
        return new JsonResponse(['error' => 'Appointment not found'], Response::HTTP_NOT_FOUND);
    }

    $property = $appointment->getProperty();
    $owner = $property->getUser();

    if ($owner !== $user) {
        return new JsonResponse(['error' => 'You are not authorized to approve this appointment'], Response::HTTP_FORBIDDEN);
    }

    $appointment->setStatus('approved');
    $this->em->flush();

    return new JsonResponse(['message' => 'Appointment approved successfully'], Response::HTTP_OK);
}



#[Route('/api/my-appointments', name: 'get_user_appointments', methods: ['GET'])]
public function getUserAppointments(): JsonResponse
{
    $user = $this->getUser();

    if (!$user) {
        return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
    }

    $appointments = $this->em->getRepository(Appointment::class)->findBy(['user' => $user]);

    $data = [];
    

    foreach ($appointments as $appointment) {
        $data[] = [
            'id' => $appointment->getId(),
            'status' => $appointment->getStatus(),
            'appointmentDate' => $appointment->getAppointmentDate()?->format('Y-m-d'),
            'appointmentTime' => $appointment->getAppointmentTime()?->format('H:i'),
            'message' => $appointment->getMessage(),
            'propertyId' => $appointment->getProperty()?->getId(),
        ];
    }

    return new JsonResponse($data, Response::HTTP_OK);
}










}


