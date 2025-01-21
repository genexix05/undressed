<?php

namespace App\Command;

use App\Provider\TicketProviderInterface;
use App\Provider\VividSeatsProvider;
use App\Provider\SeatGeekProvider;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Psr\Log\LoggerInterface;

class AnalyzeTicketsCommand extends Command
{
    // Usar getDefaultName en lugar de $defaultName
    public static function getDefaultName(): string
    {
        return 'app:analyze-tickets';
    }

    private VividSeatsProvider $vividSeatsProvider;
    private SeatGeekProvider $seatGeekProvider;
    private LoggerInterface $logger;

    public function __construct(VividSeatsProvider $vividSeatsProvider, SeatGeekProvider $seatGeekProvider, LoggerInterface $logger)
    {
        parent::__construct();
        $this->vividSeatsProvider = $vividSeatsProvider;
        $this->seatGeekProvider = $seatGeekProvider;
        $this->logger = $logger;
    }

    protected function configure()
    {
        $this
            ->setDescription('Analiza las entradas disponibles para un evento.')
            ->addArgument('url', InputArgument::REQUIRED, 'URL del evento');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $url = $input->getArgument('url');

        $this->logger->info('Iniciando análisis de tickets para la URL: ' . $url);

        $provider = $this->getProvider($url);

        if (!$provider) {
            $output->writeln('<error>Plataforma no soportada.</error>');
            return Command::FAILURE;
        }

        try {
            $tickets = $provider->getAvailableTickets($url);

            if (empty($tickets)) {
                $output->writeln('<comment>No se encontraron entradas disponibles.</comment>');
                return Command::SUCCESS;
            }

            foreach ($tickets as $ticket) {
                $output->writeln(sprintf(
                    'Sección: %s | Fila: %s | Cantidad: %s | Precio: $%0.2f',
                    $ticket->getSection(),
                    $ticket->getRow(),
                    $ticket->getQuantity(),
                    $ticket->getPrice()
                ));
            }

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $output->writeln('<error>Error: ' . $e->getMessage() . '</error>');
            return Command::FAILURE;
        }
    }

    private function getProvider(string $url): ?TicketProviderInterface
    {
        if (strpos($url, 'vividseats.com') !== false) {
            return $this->vividSeatsProvider;
        }

        if (strpos($url, 'seatgeek.com') !== false) {
            return $this->seatGeekProvider;
        }

        return null;
    }
}
