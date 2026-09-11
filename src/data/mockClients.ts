import type { Client } from '../types'

export const mockClients: Client[] = [
  {
    id: 'c_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    fundType: 'Hedge Fund A',
    photoUrl: 'https://placehold.co',
    status: 'online',
  },
  {
    id: 'c_2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    fundType: 'Private Equity B',
    photoUrl: 'https://placehold.co',
    status: 'offline',
  },
  {
    id: 'c_3',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    fundType: 'Venture Capital C',
    photoUrl: 'https://placehold.co',
    status: 'online',
  },
]
