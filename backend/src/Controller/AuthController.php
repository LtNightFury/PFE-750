<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Entity\Contactus;
 


#[Route('/api', name: 'api_')]
class AuthController extends AbstractController
{
    private $passwordHasher;
    private $entityManager;
    private $validator;
    private $userRepository;
    private $mailer;
    private $urlGenerator;

    public function __construct(
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        MailerInterface $mailer,
        UrlGeneratorInterface $urlGenerator
    ) {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->mailer = $mailer;
        $this->urlGenerator = $urlGenerator;
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
public function register(Request $request): JsonResponse
{
    $data = json_decode($request->getContent(), true);
    
    // Validate required fields
    if (!isset($data['email']) || !isset($data['password'])) {
        return $this->json(['message' => 'Email and password are required'], Response::HTTP_BAD_REQUEST);
    }
    
    // Check if user already exists
    $existingUser = $this->userRepository->findByEmail($data['email']);
    if ($existingUser) {
        return $this->json(['message' => 'User already exists'], Response::HTTP_CONFLICT);
    }
    
    // Create new user
    $user = new User();
    $user->setEmail($data['email']);
    $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
    if ($data['role']=='owner') {
        $user->setRoles(['ROLE_OWNER']);
    }else  {
        $user->setRoles(['ROLE_USER']);   
    }
    
    $user->setPhoneNumber($data['phoneNumber']);

    
    // Add the name field
   
        $user->setName($data['name']);
        $user->setLastName($data['lastName']);

    
    // Validate user entity
    $errors = $this->validator->validate($user);
    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = $error->getMessage();
        }
        return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
    }
    
    // Save user
    $this->entityManager->persist($user);
    $this->entityManager->flush();
    
    return $this->json(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }
    #[Route('/forgot-password', name: 'forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['email'])) {
            return $this->json(['message' => 'Email is required'], Response::HTTP_BAD_REQUEST);
        }
        
        $user = $this->userRepository->findByEmail($data['email']);
        
        if (!$user) {
            // Don't reveal that the user doesn't exist for security
            return $this->json(['message' => 'If your email exists in our system, you will receive a password reset link'], Response::HTTP_OK);
        }
        
        // Generate reset token
        $token = bin2hex(random_bytes(32));
        $user->setResetToken($token);
        
        // Set expiration time (e.g., 1 hour)
        $expiresAt = new \DateTime();
        $expiresAt->modify('+1 hour');
        $user->setResetTokenExpiresAt($expiresAt);
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        // Send email with reset link
        // In a real application, you would create a frontend URL with the token
        $resetUrl = 'localhost:4200/reset-password/' . $token;
        
        $email = (new Email())
            ->from('noreply@yourapp.com')
            ->to($user->getEmail())
            ->subject('Password Reset Request')
            ->html("<p>To reset your password, please click the link below:</p><p><a href=\"{$resetUrl}\">Reset Password</a></p><p>This link will expire in 1 hour.</p>");
        
        $this->mailer->send($email);
        
        return $this->json(['message' => 'If your email exists in our system, you will receive a password reset link'], Response::HTTP_OK);
    }

    #[Route('/reset-password', name: 'reset_password', methods: ['POST'])]
    public function resetPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['token']) || !isset($data['password'])) {
            return $this->json(['message' => 'Token and password are required'], Response::HTTP_BAD_REQUEST);
        }
        
        $user = $this->userRepository->findByResetToken($data['token']);
        
        if (!$user) {
            return $this->json(['message' => 'Invalid token'], Response::HTTP_BAD_REQUEST);
        }
        
        // Check if token has expired
        $now = new \DateTime();
        if ($user->getResetTokenExpiresAt() < $now) {
            return $this->json(['message' => 'Token has expired'], Response::HTTP_BAD_REQUEST);
        }
        
        // Update password
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setResetToken(null);
        $user->setResetTokenExpiresAt(null);
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Password has been reset successfully'], Response::HTTP_OK);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    #[Route('/user', name: 'get_current_user', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
    
        if (!$user) {
            return $this->json(['message' => 'Unauthorized']);
        }
    
        
        
    
        return $this->json([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
            'email' => $user->getEmail(),
            'profileImage' => $user->getProfileImage(),
            'phoneNumber' => $user->getPhoneNumber(),
        ]);
    }
  

    #[Route('/user', name: 'update_current_user', methods: ['POST'])]
    public function updateCurrentUser(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
    
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        if ($request->request->has('lastName')) {
            $user->setLastname($request->request->get('lastName'));
        }
        
        if ($request->request->has('name')) {
            $user->setName($request->request->get('name'));
        }
        
        if ($request->request->has('phoneNumber')) {
            $user->setPhoneNumber($request->request->get('phoneNumber'));
        }
    
        // Handle file upload if provided
        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');
    
        if ($file) {
            $user->setProfileImageFile($file); // Triggers VichUploader to handle saving
            
        }
    
        // Validate
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }
    
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    
        return $this->json([
            'message' => 'User updated successfully',
            'user' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles(),
                'phoneNumber' => $user->getPhoneNumber(),
                'email' => $user->getEmail(),
                'profileImage' => $user->getprofileImage(),
            ]
        ]);
    }
    #[Route('/user/update-password', name: 'update_password', methods: ['POST'])]
public function updatePassword(Request $request): JsonResponse
{
    /** @var User|null $user */
    $user = $this->getUser();

    if (!$user) {
        return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $data = json_decode($request->getContent(), true);

    if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
        return $this->json(['message' => 'Current and new passwords are required'], Response::HTTP_BAD_REQUEST);
    }

    
    if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
        return $this->json(['message' => 'Invalid current password'], Response::HTTP_BAD_REQUEST);
    }

    
    $user->setPassword($this->passwordHasher->hashPassword($user, $data['newPassword']));

    $this->entityManager->persist($user);
    $this->entityManager->flush();

    return $this->json(['message' => 'Password updated successfully'], Response::HTTP_OK);
}

#[Route('/user/remove-profile-picture', name: 'remove_profile_picture', methods: ['POST'])]
public function removeProfilePicture(): JsonResponse
{
    /** @var User|null $user */
    $user = $this->getUser();

    if (!$user) {
        return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

 
    $user->setProfileImage(null);
    $user->setProfileImageFile(null); 

    $this->entityManager->persist($user);
    $this->entityManager->flush();

    return $this->json(['message' => 'Profile picture removed successfully'], Response::HTTP_OK);
}

#[Route('/contact', name: 'app_contactus_post', methods: ['POST'])]
public function createContact(Request $request, EntityManagerInterface $em): JsonResponse
{
    /** @var User|null $user */
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }
    $data = json_decode($request->getContent(), true);

    if (
        !isset($data['fullname'], $data['email'], $data['phonenumber'], $data['subject'], $data['message'])
    ) {
        return new JsonResponse(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
    }

    $contact = new Contactus();
    $contact->setUser($user); // Set the user who is sending the message
    $contact->setFullname($data['fullname']);
    $contact->setEmail($data['email']);
    $contact->setPhonenumber((int) $data['phonenumber']);
    $contact->setSubject($data['subject']);
    $contact->setMessage($data['message']);

    $em->persist($contact);
    $em->flush();

    return new JsonResponse([
        'message' => 'Contact message received successfully!',
        'id' => $contact->getId()
    ], Response::HTTP_CREATED);
}
}