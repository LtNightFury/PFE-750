<?php

namespace App\Repository;

use App\Entity\FloorPlans;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FloorPlans>
 *
 * @method FloorPlans|null find($id, $lockMode = null, $lockVersion = null)
 * @method FloorPlans|null findOneBy(array $criteria, array $orderBy = null)
 * @method FloorPlans[]    findAll()
 * @method FloorPlans[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FloorPlansRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FloorPlans::class);
    }

//    /**
//     * @return FloorPlans[] Returns an array of FloorPlans objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?FloorPlans
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
