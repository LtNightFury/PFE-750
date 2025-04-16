<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use app\entity\General;
use App\Entity\User;
use App\Entity\Property;
use App\Repository\GeneralRepository;
use App\Repository\PropertyRepository;
use App\Entity\Booking;
use App\Repository\BookingRepository;


use Symfony\Component\Serializer\SerializerInterface;
#[Route('/api', name: 'api_')]
class PropertyController extends AbstractController
{
    private $propertyRepository;
    private $generalRepository;
    public function __construct(
        GeneralRepository $generalRepository,
        PropertyRepository $propertyRepository,
        
    ) {
        $this->generalRepository = $generalRepository;
        $this->propertyRepository = $propertyRepository;
    }
    #[Route('/property', name: 'app_property')]
    public function index(): Response
    {
        return $this->render('property/index.html.twig', [
            'controller_name' => 'PropertyController',
        ]);
    }
    #[Route('/properties', name: 'property_create', methods: ['POST'])]
public function create(Request $request): JsonResponse
{
    $user = $this->getUser();
    
    // Get JSON data
    $data = json_decode($request->get('data'), true);

    
    $mediaFiles = [];

    $photos = $request->files->get('photos');
    if ($photos) {
        $mediaFiles['photos'] = $photos;
    }

    $floorplans = $request->files->get('floorPlans');
    if ($floorplans) {
        $mediaFiles['floorPlans'] = $floorplans;
    }
    $document = $request->files->get('documents');
    if ($document) {
        $mediaFiles['documents'] = $document;
    }


    if (!empty($mediaFiles)) {
        $data['mediaFiles'] = $mediaFiles;
    }


    
    $property = $this->propertyRepository->createProperty($data, $user);
    
    return $this->json([
        'success' => true,
        'property' => $property->getId()
    ]);
}

    

#[Route('/properties/', name: 'property_get', methods: ['GET'])]
public function listProperties(PropertyRepository $propertyRepository, SerializerInterface $serializer)
{
    // Only fetch properties where approval = 'approved'
    $properties = $propertyRepository->findBy(['approval' => 'approved']);

    // Serialize with circular reference handler
    $json = $serializer->serialize($properties, 'json', [
        'circular_reference_handler' => function ($object) {
            return $object->getId();
        },
        'ignored_attributes' => ['__initializer__', '__cloner__', '__isInitialized__','user','approval']
    ]);

    return new JsonResponse($json, 200, [], true);
}

#[Route('/properties/{id}', name: 'property_get_by_id', methods: ['GET'])]
public function getPropertyById($id, PropertyRepository $propertyRepository, SerializerInterface $serializer)
{
    $property = $propertyRepository->find($id);
    
    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }
    
    // Use Symfony's serializer with proper context to handle circular references
    $json = $serializer->serialize($property, 'json', [
        'circular_reference_handler' => function ($object) {
            return $object->getId();
        },
        'ignored_attributes' => ['__initializer__', '__cloner__', '__isInitialized__','user']
    ]);
    
    // Return a JSON response directly
    return new JsonResponse($json, 200, [], true);
   
}
#[Route('/properties/{id}/approval', name: 'property_approval_update', methods: ['PATCH'])]
public function updateApprovalStatus(
    int $id,
    Request $request,
    PropertyRepository $propertyRepository,
    EntityManagerInterface $em
): JsonResponse {
    $user = $this->getUser();

    // Check if user is an admin
    if (!$user || !in_array('ROLE_ADMIN', $user->getRoles())) {
        return new JsonResponse(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
    }

    $property = $propertyRepository->find($id);

    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }

    $data = json_decode($request->getContent(), true);
    $newStatus = $data['approval'] ?? null;

    if (!$newStatus) {
        return new JsonResponse(['error' => 'No approval status provided'], Response::HTTP_BAD_REQUEST);
    }

    // Only allow changing if current status is "pending"
    if ($property->getApproval() !== 'pending') {
        return new JsonResponse(['error' => 'Only pending properties can be updated'], Response::HTTP_CONFLICT);
    }

    $property->setApproval($newStatus);
    $em->flush();

    return new JsonResponse(['success' => true, 'newApproval' => $newStatus], Response::HTTP_OK);
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

#[Route('/bookings/{id}/approval', name: 'approve_booking', methods: ['POST'])]
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
#[Route('/properties/{id}', name: 'property_update', methods: ['PUT', 'PATCH'])]
public function update(int $id, Request $request): JsonResponse
{
    // Ensure the user is authenticated
    $user = $this->getUser();
    
    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
    }

    // Retrieve the property
    $property = $this->propertyRepository->find($id);
    
    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }
    
    // Get JSON data from the request body
    $data = json_decode($request->getContent(), true); // Use getContent for the raw body
    
    if (!$data) {
        return new JsonResponse(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
    }
    
    $mediaFiles = [];
    
    // Handle file uploads (photos, floorplans, documents)
    $photos = $request->files->get('photos');
    if ($photos) {
        $mediaFiles['photos'] = $photos;
    }
    
    $floorplans = $request->files->get('floorPlans');
    if ($floorplans) {
        $mediaFiles['floorPlans'] = $floorplans;
    }
    
    $documents = $request->files->get('documents');
    if ($documents) {
        $mediaFiles['documents'] = $documents;
    }
    
    // If there are media files, add them to the data array
    if (!empty($mediaFiles)) {
        $data['mediaFiles'] = $mediaFiles;
    }
    
    try {
        // Call the update method on the property repository
        $property = $this->propertyRepository->updateProperty($property, $data, $user);
        
        return $this->json([
            'success' => true,
            'property' => $property->getId()
        ]);
    } catch (\Exception $e) {
        // Return an error response with exception message
        return $this->json([
            'success' => false,
            'message' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
#[Route('/properties/{id}', name: 'property_delete', methods: ['DELETE'])]
public function delete(int $id, EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    
    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
    }

    $property = $this->propertyRepository->find($id);

    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }

    if ($property->getUser() !== $user) {
        return new JsonResponse(['error' => 'Unauthorized to delete this property'], Response::HTTP_FORBIDDEN);
    }

    $em->remove($property);
    $em->flush();

    return new JsonResponse(['success' => true, 'message' => 'Property deleted successfully']);
}



}
