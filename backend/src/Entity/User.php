<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $resetToken = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $resetTokenExpiresAt = null;
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Property::class)]
    private Collection $properties;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Booking::class, orphanRemoval: true)]
    private Collection $bookings;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Contract::class)]
    private Collection $contracts;


    public function __construct()
{
        $this->properties = new ArrayCollection();
        $this->bookings = new ArrayCollection();
        $this->contracts = new ArrayCollection();
}

    public function getName(): ?string
{
    return $this->name;
}

public function setName(string $name): static
{
    $this->name = $name;

    return $this;
}

    public function getId(): ?int
    {
        return $this->id;
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

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
    }

    public function getSalt(): ?string
    {
        // Return null as the salt is not needed when using modern password hashing
        return null;
    }

    public function getUsername(): string
    {
        // This method is deprecated, redirect to getUserIdentifier() instead
        return $this->getUserIdentifier();
    }

    public function getResetToken(): ?string
    {
        return $this->resetToken;
    }

    public function setResetToken(?string $resetToken): static
    {
        $this->resetToken = $resetToken;
        
        return $this;
    }

    public function getResetTokenExpiresAt(): ?\DateTimeInterface
    {
        return $this->resetTokenExpiresAt;
    }

    public function setResetTokenExpiresAt(?\DateTimeInterface $resetTokenExpiresAt): static
    {
        $this->resetTokenExpiresAt = $resetTokenExpiresAt;
        
        return $this;
    }
    public function getProperties(): Collection
{
    return $this->properties;
}

public function addProperty(Property $property): self
{
    if (!$this->properties->contains($property)) {
        $this->properties[] = $property;
        $property->setUser($this);
    }

    return $this;
}

public function removeProperty(Property $property): self
{
    if ($this->properties->removeElement($property)) {
        if ($property->getUser() === $this) {
            $property->setUser(null);
        }
    }

    return $this;
}

/**
 * @return Collection<int, Booking>
 */
public function getBookings(): Collection
{
    return $this->bookings;
}

public function addBooking(Booking $booking): static
{
    if (!$this->bookings->contains($booking)) {
        $this->bookings->add($booking);
        $booking->setUser($this);
    }

    return $this;
}

public function removeBooking(Booking $booking): static
{
    if ($this->bookings->removeElement($booking)) {
        // set the owning side to null (unless already changed)
        if ($booking->getUser() === $this) {
            $booking->setUser(null);
        }
    }

    return $this;
}

/**
 * @return Collection<int, Contract>
 */
public function getContracts(): Collection
{
    return $this->contracts;
}

public function addContract(Contract $contract): static
{
    if (!$this->contracts->contains($contract)) {
        $this->contracts->add($contract);
        $contract->setOwner($this);
    }

    return $this;
}

public function removeContract(Contract $contract): static
{
    if ($this->contracts->removeElement($contract)) {
        // set the owning side to null (unless already changed)
        if ($contract->getOwner() === $this) {
            $contract->setOwner(null);
        }
    }

    return $this;
}
   
}