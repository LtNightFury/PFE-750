<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Property;
use App\Repository\PropertyRepository;
use App\Repository\UserRepository;
use Symfony\Component\Serializer\SerializerInterface;
use App\Entity\User;
use App\Entity\Contactus;
use App\Repository\ContactusRepository;


#[Route('/api/admin', name: 'app_admin')]
class AdminController extends AbstractController
{
    private $propertyRepository;
    private $userRepository;
    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager, PropertyRepository $propertyRepository, UserRepository $userRepository)
    {
        $this->entityManager = $entityManager;
        $this->propertyRepository = $propertyRepository;
        $this->userRepository = $userRepository;
    }

    
    public function index(): Response
    {
        return $this->render('admin/index.html.twig', [
            'controller_name' => 'AdminController',
        ]);
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
#[Route('/user/{id}/delete', name: 'delete_user', methods: ['DELETE'])]
public function deleteUser(int $id): JsonResponse
{
    // Check if current user has admin rights
    if (!$this->isGranted('ROLE_ADMIN')) {
        return $this->json(['message' => 'Access denied'], Response::HTTP_FORBIDDEN);
    }
    
    $user = $this->userRepository->find($id);
    
    if (!$user) {
        return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
    }
    
    // Remove the user
    $this->entityManager->remove($user);
    $this->entityManager->flush();
    
    return $this->json(['message' => 'User has been deleted successfully'], Response::HTTP_OK);
}

#[Route('/properties/{id}', name: 'admin_property_delete', methods: ['DELETE'])]
public function deleteAdminProperty(int $id, EntityManagerInterface $em): JsonResponse
{
    $this->denyAccessUnlessGranted('ROLE_ADMIN');

    $property = $this->propertyRepository->find($id);

    if (!$property) {
        return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
    }

    $em->remove($property);
    $em->flush();

    return new JsonResponse(['success' => true, 'message' => 'Property deleted successfully']);
}
#[Route('/properties', name: 'property_get', methods: ['GET'])]
public function listProperties(PropertyRepository $propertyRepository, SerializerInterface $serializer)
{
    $properties = $propertyRepository->findBy(['approval' => 'pending']);

    $json = $serializer->serialize($properties, 'json', [
        'groups' => ['property:read'],
        'circular_reference_handler' => function ($object) {
            return $object->getId();
        },
    ]);

    return new JsonResponse($json, 200, [], true);
}
#[Route('/users', name: 'admin_users_list', methods: ['GET'])]
public function getUsers(UserRepository $userRepository, SerializerInterface $serializer): JsonResponse {
    $users = $userRepository->findAll();
    $json = $serializer->serialize($users, 'json', [
        'groups' => ['admin:read'],
         
    ]);
    return new JsonResponse($json, Response::HTTP_OK, [], true);
}

#[Route('/contactus', name: 'admin_contactus_list', methods: ['GET'])]
public function getContactUs(ContactusRepository $contactusRepository, SerializerInterface $serializer): JsonResponse {
    $contactus = $contactusRepository->findAll();
    $json = $serializer->serialize($contactus, 'json', [
        'groups' => ['admin:read'],
         
    ]);
    return new JsonResponse($json, Response::HTTP_OK, [], true);





}
#[Route('/analytics/user-growth', name: 'admin_user_growth')]
public function userGrowth(UserRepository $userRepository): JsonResponse
{
    $data = $userRepository->countUsersPerMonth();
    return $this->json($data);
}


#[Route('/analytics/property-growth', name: 'admin_property_growth')]
public function propertyGrowth(PropertyRepository $propertyRepository): JsonResponse
{
    $data = $propertyRepository->countPropertiesPerMonth();
    return $this->json($data);

}
}
