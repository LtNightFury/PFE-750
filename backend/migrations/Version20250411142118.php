<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250411142118 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE contacts (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(255) NOT NULL, phone BIGINT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE property ADD contacts_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE property ADD CONSTRAINT FK_8BF21CDEB92D5262 FOREIGN KEY (amenities_id) REFERENCES amenities (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE property ADD CONSTRAINT FK_8BF21CDE719FB48E FOREIGN KEY (contacts_id) REFERENCES contacts (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_8BF21CDEB92D5262 ON property (amenities_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_8BF21CDE719FB48E ON property (contacts_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE property DROP FOREIGN KEY FK_8BF21CDE719FB48E
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE contacts
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE property DROP FOREIGN KEY FK_8BF21CDEB92D5262
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_8BF21CDEB92D5262 ON property
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_8BF21CDE719FB48E ON property
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE property DROP contacts_id
        SQL);
    }
}
