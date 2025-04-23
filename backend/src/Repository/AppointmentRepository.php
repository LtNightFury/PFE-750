<?php

namespace App\Repository;

use App\Entity\Appointment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Appointment>
 *
 * @method Appointment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Appointment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Appointment[]    findAll()
 * @method Appointment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppointmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Appointment::class);
    }

//    /**
//     * @return Appointment[] Returns an array of Appointment objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Appointment
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
 /**
     * Get booked time slots (in H:i format) for a property on a specific date.
     *
     * @param int $propertyId
     * @param \DateTime $date
     * @return string[] List of booked times (e.g. ['09:00', '09:30', ...])
     */
    public function getBookedSlotsForDate(int $propertyId, \DateTime $date): array
    {
        $qb = $this->createQueryBuilder('a')
            ->select('a.appointmentTime')
            ->where('a.property = :propertyId')
            ->andWhere('a.appointmentDate = :appointmentDate')
            ->setParameter('propertyId', $propertyId)
            ->setParameter('appointmentDate', $date->format('Y-m-d'));

        $results = $qb->getQuery()->getResult();

        return array_map(function ($row) {
            if ($row['appointmentTime'] instanceof \DateTimeInterface) {
                return $row['appointmentTime']->format('H:i');
            }
            return null;
        }, $results);
    }
}
