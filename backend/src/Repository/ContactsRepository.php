<?php

namespace App\Repository;

use App\Entity\Contacts;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Contacts>
 *
 * @method Contacts|null find($id, $lockMode = null, $lockVersion = null)
 * @method Contacts|null findOneBy(array $criteria, array $orderBy = null)
 * @method Contacts[]    findAll()
 * @method Contacts[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ContactsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Contacts::class);
    }

//    /**
//     * @return Contacts[] Returns an array of Contacts objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Contacts
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
    public function addContact($contactData): Contacts
    {
        $entityManager = $this->getEntityManager();
        
        // Convert to array if object
        if (is_object($contactData)) {
            $contactData = json_decode(json_encode($contactData), true);
        }
        
        // Create new Contacts entity
        $contact = new Contacts();
        $contact->setEmail($contactData['email']);
        $contact->setPhone($contactData['phone']);
        
        
        // Persist the entity
        $entityManager->persist($contact);
        $entityManager->flush();
        
        return $contact;
    }
    public function updateContacts(Contacts $contacts, $data): Contacts
{
    // Ensure $data is an array
    if (is_object($data)) {
        $data = json_decode(json_encode($data), true);
    }

    if (isset($data['email'])) {
        $contacts->setEmail($data['email']);
    }

    if (isset($data['phone'])) {
        $contacts->setPhone($data['phone']);
    }

    return $contacts;
}

}
