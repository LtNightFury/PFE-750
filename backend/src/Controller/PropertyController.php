<?php

namespace App\Controller;

use App\Entity\Property;
use App\Repository\PropertyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/properties', name: 'property_')]
class PropertyController extends AbstractController
{
    private PropertyRepository $propertyRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(PropertyRepository $propertyRepository, EntityManagerInterface $entityManager)
    {
        $this->propertyRepository = $propertyRepository;
        $this->entityManager = $entityManager;
    }

    // List all properties
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $properties = $this->propertyRepository->findAll();
        return $this->json($properties, Response::HTTP_OK);
    }

    // Create a new property
    #[Route('/', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $property = new Property();
        $property->setTitle($data['title']);
        $property->setType($data['type']);
        $property->setDescription($data['description']);
        $property->setPrice($data['price']);
        $property->setSize($data['size']);
        $property->setStatus($data['status']);
        $property->setLatitude($data['latitude']);
        $property->setLongitude($data['longitude']);
        $property->setYearBuilt($data['yearBuilt']);
        $property->setIsAvailableDate(new \DateTime($data['isAvailableDate'] ?? 'now'));
        $property->setPhotos($data['photos']);
        $property->setNbreRooms($data['nbreRooms']);
        $property->setNbreBath($data['nbreBath']);
        $property->setNbreofParking($data['nbreofParking']);
        $property->setAmenities($data['amenities']);
        $property->setVideoTour($data['videoTour'] ?? null);

        $this->entityManager->persist($property);
        $this->entityManager->flush();

        return $this->json($property, Response::HTTP_CREATED);
    }

    // Get a single property by ID
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $property = $this->propertyRepository->find($id);

        if (!$property) {
            return $this->json(['message' => 'Property not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($property, Response::HTTP_OK);
    }

    // Update a property
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $property = $this->propertyRepository->find($id);

        if (!$property) {
            return $this->json(['message' => 'Property not found'], Response::HTTP_NOT_FOUND);
        }

        $property->setTitle($data['title'] ?? $property->getTitle());
        $property->setType($data['type'] ?? $property->getType());
        $property->setDescription($data['description'] ?? $property->getDescription());
        $property->setPrice($data['price'] ?? $property->getPrice());
        $property->setSize($data['size'] ?? $property->getSize());
        $property->setStatus($data['status'] ?? $property->getStatus());
        $property->setLatitude($data['latitude'] ?? $property->getLatitude());
        $property->setLongitude($data['longitude'] ?? $property->getLongitude());
        $property->setYearBuilt($data['yearBuilt'] ?? $property->getYearBuilt());
        $property->setIsAvailableDate(new \DateTime($data['isAvailableDate'] ?? 'now'));
        $property->setPhotos($data['photos'] ?? $property->getPhotos());
        $property->setNbreRooms($data['nbreRooms'] ?? $property->getNbreRooms());
        $property->setNbreBath($data['nbreBath'] ?? $property->getNbreBath());
        $property->setNbreofParking($data['nbreofParking'] ?? $property->getNbreofParking());
        $property->setAmenities($data['amenities'] ?? $property->getAmenities());
        $property->setVideoTour($data['videoTour'] ?? $property->getVideoTour());

        $this->entityManager->flush();

        return $this->json($property, Response::HTTP_OK);
    }

    // Delete a property
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $property = $this->propertyRepository->find($id);

        if (!$property) {
            return $this->json(['message' => 'Property not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($property);
        $this->entityManager->flush();

        return $this->json(['message' => 'Property deleted successfully'], Response::HTTP_NO_CONTENT);
    }

    // Example of a custom query method to search properties by status
    #[Route('/status/{status}', name: 'by_status', methods: ['GET'])]
    public function findByStatus(string $status): JsonResponse
    {
        $properties = $this->propertyRepository->findByStatus($status);

        return $this->json($properties, Response::HTTP_OK);
    }

    // Example of a custom query method to search properties by price range
    #[Route('/price-range/{minPrice}/{maxPrice}', name: 'by_price_range', methods: ['GET'])]
    public function findByPriceRange(float $minPrice, float $maxPrice): JsonResponse
    {
        $properties = $this->propertyRepository->findByPriceRange($minPrice, $maxPrice);

        return $this->json($properties, Response::HTTP_OK);
    }
}
