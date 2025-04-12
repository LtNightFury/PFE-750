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
    $properties = $propertyRepository->findAll();
    
    // Use Symfony's serializer with proper context to handle circular references
    $json = $serializer->serialize($properties, 'json', [
        'circular_reference_handler' => function ($object) {
            return $object->getId();
        },
        'ignored_attributes' => ['__initializer__', '__cloner__', '__isInitialized__','user']
    ]);
    
    // Return a JSON response directly
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
}
