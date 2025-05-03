<?php

namespace App\Repository;

use App\Entity\PropertyView;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PropertyView>
 *
 * @method PropertyView|null find($id, $lockMode = null, $lockVersion = null)
 * @method PropertyView|null findOneBy(array $criteria, array $orderBy = null)
 * @method PropertyView[]    findAll()
 * @method PropertyView[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PropertyViewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PropertyView::class);
    }

//    /**
//     * @return PropertyView[] Returns an array of PropertyView objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?PropertyView
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
