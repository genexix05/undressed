<?php

namespace App\Entity;

class Ticket
{
    private $section;
    private $row;
    private $price;
    private $quantity;

    public function getSection(): ?string
    {
        return $this->section;
    }

    public function setSection(string $section): self
    {
        $this->section = $section;
        return $this;
    }

    public function getRow(): ?string
    {
        return $this->row;
    }

    public function setRow(string $row): self
    {
        $this->row = $row;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getQuantity(): ?string
    {
        return $this->quantity;
    }

    public function setQuantity(string $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }
}
