<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use app\entity\General;
use App\Entity\Property;
use App\Repository\GeneralRepository;
use App\Repository\PropertyRepository;
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
    public function create(Request $request,): JsonResponse
    {
        
        $data = json_decode($request->getContent(), true);


        if (!$data) {
            return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $property = $this->propertyRepository->createProperty($data);
        return $this->json([
            'success' => true,
            'property' => $property->getId()
        ]);
    }
}
