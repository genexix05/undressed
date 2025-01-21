<?php

namespace App\Provider;

use App\Entity\Ticket;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SeatGeekProvider implements TicketProviderInterface
{
    private HttpClientInterface $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getAvailableTickets(string $url): array
{
        $response = $this->httpClient->request('GET', $url, [
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' .
                                'AppleWebKit/537.36 (KHTML, like Gecko) ' .
                                'Chrome/87.0.4280.88 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,' .
                            'image/avif,image/webp,image/apng,*/*;q=0.8,' .
                            'application/signed-exchange;v=b3;q=0.9',
                'Accept-Language' => 'en-US,en;q=0.9',
            ],
        ]);

        $html = $response->getContent();

        $crawler = new Crawler($html);

        // Seleccionar todos los elementos div con data-testid="listing-item"
        $listingDivs = $crawler->filter('div[data-testid="listing-item"]');

        $tickets = [];

        foreach ($listingDivs as $div) {
            $divCrawler = new Crawler($div);
            $ariaLabel = $divCrawler->attr('aria-label');

            if ($ariaLabel) {
                $ticketInfo = $this->parseAriaLabel($ariaLabel);

                if ($ticketInfo) {
                    $ticket = new Ticket();
                    $ticket->setSection($ticketInfo['section']);
                    $ticket->setRow($ticketInfo['row']);
                    $ticket->setPrice($ticketInfo['price']);
                    $ticket->setQuantity($ticketInfo['tickets']);

                    $tickets[] = $ticket;
                }
            }
        }

        return $tickets;
    }

    private function parseAriaLabel(string $ariaLabel): ?array
    {
        // Ejemplo de aria-label:
        // "Section 147 A, Row 1, 2 tickets at $2,035 each, Deal Score 10"

        $result = [];

        // Dividir por comas
        $parts = explode(',', $ariaLabel);

        foreach ($parts as &$part) {
            $part = trim($part);
        }

        // Extraer sección
        if (isset($parts[0])) {
            if (preg_match('/Section\s+(.*)/', $parts[0], $matches)) {
                $result['section'] = $matches[1];
            } else {
                return null; // Formato inesperado
            }
        }

        // Extraer fila
        if (isset($parts[1])) {
            if (preg_match('/Row\s+(.*)/', $parts[1], $matches)) {
                $result['row'] = $matches[1];
            } else {
                return null;
            }
        }

        // Extraer cantidad de boletos y precio
        if (isset($parts[2])) {
            if (preg_match('/(\d+)(?:-(\d+))?\s+tickets?\s+at\s+\$(.*)\s+each/', $parts[2], $matches)) {
                $result['tickets'] = isset($matches[2]) ? $matches[1] . '-' . $matches[2] : $matches[1];
                $price = str_replace(',', '', $matches[3]);
                $result['price'] = $price;
            } else {
                return null;
            }
        }

        // Deal Score (opcional)
        if (isset($parts[3])) {
            if (preg_match('/Deal Score (\d+)/', $parts[3], $matches)) {
                $result['deal_score'] = $matches[1];
            }
        }

        return $result;
    }
}
