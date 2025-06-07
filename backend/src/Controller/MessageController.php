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

    #[Route('api/messagescount', name: 'COUNT_message', methods: ['GET'])]
    public function getMessageCount(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $messages = $em->getRepository(Message::class)->findBy(['owner' => $user, 'isRead' => false]);


        return $this->json(count($messages), 200, [], []);
}


    #[Route('api/messages/{id}', name: 'delete_message', methods: ['DELETE'])]
    public function deleteMessage(int $id, EntityManagerInterface $em): JsonResponse
    {
        $message = $em->getRepository(Message::class)->find($id);
        if (!$message) {
            return new JsonResponse(['error' => 'Message not found'], Response::HTTP_NOT_FOUND);
        }
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $owner = $message->getOwner();
        if ($owner !== $user) {
            return new JsonResponse(['error' => 'You are not authorized to delete this message'], Response::HTTP_FORBIDDEN);
        }

        $em->remove($message);
        $em->flush();

        return new JsonResponse(['status' => 'Message deleted successfully.']);
}
#[Route('api/owner/messages/{id}/reply', name: 'reply_to_message', methods: ['POST'])]
public function replyToMessage(int $id, Request $request, EntityManagerInterface $em): JsonResponse
{
    $owner = $this->getUser();
    if (!$owner) {
        return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
    }

    $originalMessage = $em->getRepository(Message::class)->find($id);
    if (!$originalMessage) {
        return new JsonResponse(['error' => 'Original message not found'], Response::HTTP_NOT_FOUND);
    }

    

    $data = json_decode($request->getContent(), true);
    $replyContent = $data['message'] ?? null;

    if (!$replyContent) {
        return new JsonResponse(['error' => 'Reply message content is required.'], Response::HTTP_BAD_REQUEST);
    }

    $reply = new Message();
    $reply->setSubject('RE: ' . $originalMessage->getSubject());
    $reply->setMessage($replyContent);
    $reply->setCreatedAt(new \DateTimeImmutable());
    $reply->setSender($owner);
    $reply->setOwner($originalMessage->getSender());
    $reply->setProperty($originalMessage->getProperty());
    $reply->setIsRead(false);

    $em->persist($reply);
    $em->flush();

    return new JsonResponse(['status' => 'Reply sent successfully.']);
}
#[Route('api/user/messages/{id}/reply', name: 'user_reply_to_message', methods: ['POST'])]
public function userReplyToMessage(int $id, Request $request, EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
    }

    $originalMessage = $em->getRepository(Message::class)->find($id);
    if (!$originalMessage) {
        return new JsonResponse(['error' => 'Original message not found'], Response::HTTP_NOT_FOUND);
    }

    if ($originalMessage->getSender() !== $user && $originalMessage->getOwner() !== $user) {
        return new JsonResponse(['error' => 'You are not authorized to reply to this message'], Response::HTTP_FORBIDDEN);
    }

    $data = json_decode($request->getContent(), true);
    $replyContent = $data['message'] ?? null;
    $property = $originalMessage->getProperty();

    if (!$replyContent) {
        return new JsonResponse(['error' => 'Reply message content is required.'], Response::HTTP_BAD_REQUEST);
    }

    $reply = new Message();
    $reply->setSubject('RE: ' . $originalMessage->getSubject());
    $reply->setMessage($replyContent);
    $reply->setCreatedAt(new \DateTimeImmutable());
    $reply->setSender($user);
    $reply->setOwner($property->getUser()); 
    $reply->setProperty($originalMessage->getProperty());
    $reply->setIsRead(false);

    $em->persist($reply);
    $em->flush();

    return new JsonResponse(['status' => 'Reply sent successfully.']);
}
#[Route('api/user/messages', name: 'get_user_messages', methods: ['GET'])]
public function getUserMessages(EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
    }

    $messages = $em->getRepository(Message::class)->createQueryBuilder('m')
    ->where('m.sender = :user OR m.owner = :user')
    ->setParameter('user', $user)
    ->orderBy('m.createdAt', 'DESC')
    ->getQuery()
    ->getResult();


    return $this->json($messages, 200, [], ['groups' => ['message:read']]);
}


}