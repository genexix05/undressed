<?php

namespace App\Provider;

use App\Model\Ticket;

interface TicketProviderInterface
{
    /**
     * @param string $url
     * @return Ticket[]
     */
    public function getAvailableTickets(string $url): array;
}
