<?php

namespace App\Entity;

use App\Repository\ContactusRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactusRepository::class)]
class Contactus
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['admin:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['admin:read'])]
    private ?string $fullname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['admin:read'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['admin:read'])]
    private ?int $phonenumber = null;

    #[ORM\Column(length: 255)]
    #[Groups(['admin:read'])]
    private ?string $subject = null;

    #[ORM\Column(length: 1000)]
    #[Groups(['admin:read'])]
    private ?string $message = null;
    #[Groups(['admin:read'])]
    #[ORM\ManyToOne(inversedBy: 'contactuses')]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFullname(): ?string
    {
        return $this->fullname;
    }

    public function setFullname(string $fullname): static
    {
        $this->fullname = $fullname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPhonenumber(): ?int
    {
        return $this->phonenumber;
    }

    public function setPhonenumber(int $phonenumber): static
    {
        $this->phonenumber = $phonenumber;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(string $subject): static
    {
        $this->subject = $subject;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
