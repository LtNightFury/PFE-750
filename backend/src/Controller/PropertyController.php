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
        PropertyRepository $propertyRepository
        
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

    

#[Route('/properties', name: 'property_get', methods: ['GET'])]
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
