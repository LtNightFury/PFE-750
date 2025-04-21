<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Appointment;

class AppointmentController extends AbstractController
{
    private $propertyRepository;

    public function __construct(\App\Repository\PropertyRepository $propertyRepository)
    {
        $this->propertyRepository = $propertyRepository;
    }
    #[Route('/appointment', name: 'app_appointment')]
    public function index(): Response
    {
        return $this->render('appointment/index.html.twig', [
            'controller_name' => 'AppointmentController',
        ]);
    }
    // src/Controller/AppointmentController.php

#[Route('/api/appointments', name: 'api_appointments_', methods: ['POST'])]
public function bookAppointment(Request $request, EntityManagerInterface $em, ): JsonResponse
{
    $data = json_decode($request->getContent(), true);

    $user =$this->getUser();
    $property = $this->propertyRepository->find($data['propertyId']);
    $appointmentDate = new \DateTime($data['appointmentDate']);

    $appointment = new Appointment();
    $appointment->setUser($user);
    $appointment->setProperty($property);
    $appointment->setAppointmentDate($appointmentDate);
    $appointment->setNotes($data['notes'] ?? null);

    $em->persist($appointment);
    $em->flush();

    return $this->json(['message' => 'Appointment booked']);
}

}
