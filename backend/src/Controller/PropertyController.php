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
use App\Entity\PropertyView;


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
public function listProperties(PropertyRepository $propertyRepository, SerializerInterface $serializer): JsonResponse
{
    // Fetch only approved properties
    $properties = $propertyRepository->findBy(['approval' => 'approved']);

    // Serialize properties with the "property:list" group
    $json = $serializer->serialize($properties, 'json', [
        'groups' => ['property:list'],
        'circular_reference_handler' => function ($object) {
            return $object->getId();
        },
    ]);

    return new JsonResponse($json, 200, [], true);
}


#[Route('/properties/{id}', name: 'property_get_by_id', methods: ['GET'])]
public function getPropertyById($id, PropertyRepository $propertyRepository, SerializerInterface $serializer): JsonResponse
{
    $property = $propertyRepository->find($id);

    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }

    // Serialize with "property:read" group
    $json = $serializer->serialize($property, 'json', [
        'groups' => ['property:read'],
        'circular_reference_handler' => function ($object) {
            return $object->getId();
        },
    ]);

    return new JsonResponse($json, 200, [], true);
}





#[Route('/properties/{id}', name: 'property_update', methods: ['PUT', 'PATCH'])]
public function update(int $id, Request $request): JsonResponse
{
    
    $user = $this->getUser();
    
    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
    }

    // Retrieve the property
    $property = $this->propertyRepository->find($id);
    
    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }
    

    $data = json_decode($request->getContent(), true); 
    
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
#[Route('/user/properties', name: 'user_properties', methods: ['GET'])]
public function getUserProperties(PropertyRepository $propertyRepository, SerializerInterface $serializer): JsonResponse
{
    $user = $this->getUser();

    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
    }

    // Fetch properties by current user
    $properties = $propertyRepository->findBy(['user' => $user]);

    // Serialize the result
    $json = $serializer->serialize($properties, 'json', [
        'circular_reference_handler' => function ($object) {
            return $object->getId();
        },
        'ignored_attributes' => ['__initializer__', '__cloner__', '__isInitialized__','user','contract','messages']
    ]);

    return new JsonResponse($json, 200, [], true);
}
#[Route('/properties/{id}/view', name: 'property_add_view', methods: ['POST'])]
public function addView(int $id, EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }
    
    $property = $em->getRepository(Property::class)->find($id);
    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }
    
   
    
    
        // Create a new view record
        $view = new PropertyView();
        $view->setUser($user);
        $view->setProperty($property);
        $view->setViewedAt(new \DateTime());
        $em->persist($view);
        
        
        $em->persist($property);
    
    
    $em->flush();
    
    return new JsonResponse(['message' => 'View recorded'], Response::HTTP_OK);
}
#[Route('/properties/{id}/views', name: 'property_get_view_count', methods: ['GET'])]
public function getViewCount(int $id, EntityManagerInterface $em): JsonResponse
{
    $property = $em->getRepository(Property::class)->find($id);

    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }

    return new JsonResponse(['viewCount' => $property->getViewCount()], Response::HTTP_OK);
}
#[Route('/user/views', name: 'user_views', methods: ['GET'])]
public function getUserViews(EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
    }

    $views = $em->getRepository(PropertyView::class)->findBy(['user' => $user]);

    $result = [];
    foreach ($views as $view) {
        $result[] = [
            'propertyId' => $view->getProperty()->getId(),
            'propertyTitle' => $view->getProperty()->getGeneralinfo()->getTitle(),
            'propertyCity' => $view->getProperty()->getLocation()->getCity(),
            'propertySubCity' => $view->getProperty()->getLocation()->getSubcity(),
            'propertyPrice' => $view->getProperty()->getPrice()->getPrice(),
            'propertyImage' => $view->getProperty()->getMedia()->getPhotos()[0]->getImageName(), 
            'propertyType' => $view->getProperty()->getGeneralinfo()->getPropertyType(),
            'viewedAt' => $view->getViewedAt()->format('Y-m-d H:i:s')
        ];
    }

    return new JsonResponse(['views' => $result], Response::HTTP_OK);
}

#[Route('/owner/allviews', name: 'views_perowner', methods: ['GET'])]
public function getViewsPerOwner(EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
    }

    $properties = $em->getRepository(Property::class)->findBy(['user' => $user]);
    $totalViews = 0;

    foreach ($properties as $property) {
        $totalViews += count($property->getPropertyViews());
    }

    return new JsonResponse(['totalViews' => $totalViews], Response::HTTP_OK);
}
#[Route('/owner/approved-properties', name: 'approved_properties_count', methods: ['GET'])]
public function getApprovedPropertiesCount(EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();

    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
    }

    $approvedCount = $em->getRepository(Property::class)->count([
        'user' => $user,
        'approval' => 'approved'
    ]);

    return new JsonResponse(['approvedProperties' => $approvedCount], Response::HTTP_OK);
}
#[Route('/owner/all-properties-count', name: 'all_properties_count', methods: ['GET'])]
public function getAllPropertiesCount(EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
    }

    $properties = $em->getRepository(Property::class)->findBy(['user' => $user]);
    $count = count($properties);

    return new JsonResponse(['allProperties' => $count], Response::HTTP_OK);
}
#[Route('/owner/views', name: 'get_owner_views', methods: ['GET'])]
public function getOwnerViews(EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Authentication required'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    $properties = $em->getRepository(Property::class)->findBy(['user' => $user]);

    $views = [];
    foreach ($properties as $property) {
        foreach ($property->getPropertyViews() as $view) {
            $views[] = [
            'propertyId' => $view->getProperty()->getId(),
            'propertyTitle' => $view->getProperty()->getGeneralinfo()->getTitle(),
            'propertyCity' => $view->getProperty()->getLocation()->getCity(),
            'propertySubCity' => $view->getProperty()->getLocation()->getSubcity(),
            'propertyPrice' => $view->getProperty()->getPrice()->getPrice(),
            'propertyImage' => $view->getProperty()->getMedia()->getPhotos()[0]->getImageName(), 
            'propertyType' => $view->getProperty()->getGeneralinfo()->getPropertyType(),
            'viewedAt' => $view->getViewedAt()->format('Y-m-d H:i:s')
            ];
        }
    }

    return new JsonResponse(['views' => $views], JsonResponse::HTTP_OK);
}


}
