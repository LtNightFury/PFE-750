<?php

namespace App\Repository;

use App\Entity\General;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<General>
 *
 * @method General|null find($id, $lockMode = null, $lockVersion = null)
 * @method General|null findOneBy(array $criteria, array $orderBy = null)
 * @method General[]    findAll()
 * @method General[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GeneralRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        
        parent::__construct($registry, General::class);
    }

//    /**
//     * @return General[] Returns an array of General objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('g.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?General
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
public function addGeneral($generalData): General
    {
        $entityManager = $this->getEntityManager();
        
        // Convert to array if object
        if (is_object($generalData)) {
            $generalData = json_decode(json_encode($generalData), true);
        }
        
        // Create new General entity
        $general = new General();
        
        // Set the properties according to your JSON structure
        if (isset($generalData['deal_type'])) {
            $general->setDealType($generalData['deal_type']);
        }
        
        if (isset($generalData['title'])) {
            $general->setTitle($generalData['title']);
        }
        
        if (isset($generalData['description'])) {
            $general->setDescription($generalData['description']);
        }
        
        // Note the capital P in PropertyCondition matches your entity's field name
        if (isset($generalData['PropertyCondition'])) {
            $general->setPropertyCondition($generalData['PropertyCondition']);
        }
        
        if (isset($generalData['propertyType'])) {
            $general->setPropertyType($generalData['propertyType']);
        }
        
        if (isset($generalData['availabilityDate'])) {
            $general->setAvailabilityDate($generalData['availabilityDate']);
        }
        
        
       
        
        // Persist the General entity
        $entityManager->persist($general);
        $entityManager->flush();
        
        return $general;
    }
    public function updateGeneral(General $general, $generalData): General
{
    // Convert to array if object
    if (is_object($generalData)) {
        $generalData = json_decode(json_encode($generalData), true);
    }
    
    // Update the properties according to your JSON structure
    if (isset($generalData['deal_type'])) {
        $general->setDealType($generalData['deal_type']);
    }
    
    if (isset($generalData['title'])) {
        $general->setTitle($generalData['title']);
    }
    
    if (isset($generalData['description'])) {
        $general->setDescription($generalData['description']);
    }
    
    // Note the capital P in PropertyCondition matches your entity's field name
    if (isset($generalData['PropertyCondition'])) {
        $general->setPropertyCondition($generalData['PropertyCondition']);
    }
    
    if (isset($generalData['propertyType'])) {
        $general->setPropertyType($generalData['propertyType']);
    }
    
    if (isset($generalData['availabilityDate'])) {
        $general->setAvailabilityDate($generalData['availabilityDate']);
    }
    
    // No need to persist here since the entity is already managed by Doctrine
    // The flush will be called in the main updateProperty method
    
    return $general;
}
}
