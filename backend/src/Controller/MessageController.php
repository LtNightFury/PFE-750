<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Property; 
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Message;
;
use App\Repository\PropertyRepository;
use Doctrine\ORM\Mapping\Id;

class MessageController extends AbstractController
{
    #[Route('/message', name: 'app_message')]
    public function index(): Response
    {
        return $this->render('message/index.html.twig', [
            'controller_name' => 'MessageController',
        ]);
    }
    #[Route('api/properties/{id}/send-email', name: 'send_message', methods: ['POST'])]
public function sendMessage(
    int $id,
    Request $request,
    PropertyRepository $propertyRepository,
    EntityManagerInterface $em
): JsonResponse {
    $sender = $this->getUser();
    if (!$sender) {
        return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
    }

    $property = $propertyRepository->find($id);
    if (!$property) {
        return new JsonResponse(['error' => 'Property not found.'], Response::HTTP_NOT_FOUND);
    }

    $data = json_decode($request->getContent(), true);
    $subject = $data['subject'] ?? null;
    $content = $data['message'] ?? null;

    if (!$subject || !$content) {
        return new JsonResponse(['error' => 'Subject and message are required.'], Response::HTTP_BAD_REQUEST);
    }

    $owner = $property->getUser();

    $message = new Message();
    $message->setSubject($subject);
    $message->setMessage($content);
    $message->setCreatedAt(new \DateTimeImmutable());
    $message->setSender($sender);
    $message->setOwner($owner);
    $message->setProperty($property);
    $message->setIsRead(false); 

    $em->persist($message);
    $em->flush();

    return new JsonResponse(['status' => 'Message sent successfully.']);
}


    #[Route('api/owner/messages', name: 'get_messages', methods: ['GET'])]
    public function getMessages( EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $messages = $em->getRepository(Message::class)->findBy(['owner' => $user]);

        return $this->json($messages, 200, [], ['groups' => ['message:read']]);
    }
    #[Route('api/messages/{id}', name: 'get_message', methods: ['PUT'])]
    public function getMessage(int $id, EntityManagerInterface $em): JsonResponse
    {
        $message = $em->getRepository(Message::class)->find($id);
        if (!$message) {
            return new JsonResponse(['error' => 'Message not found'], Response::HTTP_NOT_FOUND);
        }
        $message->setIsRead(true);
        $em->persist($message);
        $em->flush();
        return $this->json( 'message read');
    }
}

