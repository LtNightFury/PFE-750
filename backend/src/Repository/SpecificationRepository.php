<?php

namespace App\Repository;

use App\Entity\Specification;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Specification>
 *
 * @method Specification|null find($id, $lockMode = null, $lockVersion = null)
 * @method Specification|null findOneBy(array $criteria, array $orderBy = null)
 * @method Specification[]    findAll()
 * @method Specification[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SpecificationRepository extends ServiceEntityRepository
{
    
    public function __construct(ManagerRegistry $registry)
    {
        
        parent::__construct($registry, Specification::class);
    }

//    /**
//     * @return Specification[] Returns an array of Specification objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Specification
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
    public function addSpecification($specificationData): Specification
    {
        $entityManager = $this->getEntityManager();
        
        // Convert to array if object
        if (is_object($specificationData)) {
            $specificationData = json_decode(json_encode($specificationData), true);
        }
        
        // Create new Specification entity
        $specification = new Specification();
        $specification->setBedrooms($specificationData['bedrooms']);
        $specification->setBathrooms($specificationData['bathrooms']);
        $specification->setParkingSpots($specificationData['parkingSpots']);
        $specification->setSize($specificationData['size']);
        $specification->setPlotSize($specificationData['plotSize']);
        $specification->setBuiltUpArea($specificationData['builtUpArea']);
        $specification->setConstructionYear($specificationData['constructionYear']);
        $specification->setRenovationYear($specificationData['Renovationyear']);
        $specification->setFurnishing($specificationData['Furnishing']);
       
        
        // Persist the entity
        $entityManager->persist($specification);
        $entityManager->flush();
        
        return $specification;
    }
    public function updateSpecification(Specification $specification, $specData): Specification
{
    // Convert to array if object
    if (is_object($specData)) {
        $specData = json_decode(json_encode($specData), true);
    }

    if (isset($specData['bedrooms'])) {
        $specification->setBedrooms((string) $specData['bedrooms']);
    }

    if (isset($specData['bathrooms'])) {
        $specification->setBathrooms((string) $specData['bathrooms']);
    }

    if (isset($specData['parkingSpots'])) {
        $specification->setParkingSpots((string) $specData['parkingSpots']);
    }

    if (isset($specData['size'])) {
        $specification->setSize($specData['size'] !== null ? (string) $specData['size'] : null);
    }

    if (isset($specData['plotSize'])) {
        $specification->setPlotSize($specData['plotSize'] !== null ? (string) $specData['plotSize'] : null);
    }

    if (isset($specData['builtUpArea'])) {
        $specification->setBuiltUpArea($specData['builtUpArea'] !== null ? (string) $specData['builtUpArea'] : null);
    }

    if (isset($specData['constructionYear'])) {
        $specification->setConstructionYear($specData['constructionYear'] !== null ? (int) $specData['constructionYear'] : null);
    }

    if (isset($specData['Renovationyear'])) {
        $specification->setRenovationyear($specData['Renovationyear'] !== null ? (int) $specData['Renovationyear'] : null);
    }

    if (isset($specData['Furnishing'])) {
        $specification->setFurnishing($specData['Furnishing'] !== null ? (string) $specData['Furnishing'] : null);
    }

    return $specification;
}


}
