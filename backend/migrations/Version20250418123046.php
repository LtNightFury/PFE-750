<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250418123046 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE contract (id INT AUTO_INCREMENT NOT NULL, owner_id INT NOT NULL, tenant_id INT NOT NULL, booking_id INT DEFAULT NULL, INDEX IDX_E98F28597E3C61F9 (owner_id), INDEX IDX_E98F28599033212A (tenant_id), UNIQUE INDEX UNIQ_E98F28593301C60 (booking_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE contract ADD CONSTRAINT FK_E98F28597E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE contract ADD CONSTRAINT FK_E98F28599033212A FOREIGN KEY (tenant_id) REFERENCES `user` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE contract ADD CONSTRAINT FK_E98F28593301C60 FOREIGN KEY (booking_id) REFERENCES booking (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE contract DROP FOREIGN KEY FK_E98F28597E3C61F9
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE contract DROP FOREIGN KEY FK_E98F28599033212A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE contract DROP FOREIGN KEY FK_E98F28593301C60
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE contract
        SQL);
    }
}
