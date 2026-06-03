export const EtaStatus = {
  Early: 'Early',
  OnTime: 'OnTime',
  Late: 'Late',
  Unavailable: 'Unavailable',
  Arrived: 'Arrived',
  PendingDeparture: 'PendingDeparture',
  Departed: 'Departed',
};

export const schools = [
  {
    locationId: 1,
    schoolName: 'Lincoln Elementary School',
    city: 'Springfield',
    stateAbbreviation: 'IL',
    activeVehicleCount: 6,
  },
  {
    locationId: 2,
    schoolName: 'Jefferson Middle School',
    city: 'Springfield',
    stateAbbreviation: 'IL',
    activeVehicleCount: 5,
  },
  {
    locationId: 3,
    schoolName: 'Washington High School',
    city: 'Springfield',
    stateAbbreviation: 'IL',
    activeVehicleCount: 4,
  },
];

function toTime(h, m) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function generateInitialBuses() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();

  return {
    1: [
      {
        id: '101-1',
        busNumber: '101',
        runId: 1001,
        runName: 'Route A – Northside',
        driver: 'John Smith',
        eta: toTime(h, m + 3),
        plannedTime: toTime(h, m + 3),
        departedTime: null,
        arrivalStatus: EtaStatus.OnTime,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 18,
        pickupCount: 3,
        dropoffCount: 15,
        inbound: true,
        schoolId: 1,
      },
      {
        id: '203-1',
        busNumber: '203',
        runId: 1002,
        runName: 'Route B – Eastside',
        driver: 'Mary Johnson',
        eta: toTime(h, m - 2),
        plannedTime: toTime(h, m + 1),
        departedTime: null,
        arrivalStatus: EtaStatus.Early,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 12,
        pickupCount: 5,
        dropoffCount: 7,
        inbound: true,
        schoolId: 1,
      },
      {
        id: '305-1',
        busNumber: '305',
        runId: 1003,
        runName: 'Route C – Westside',
        driver: 'Bob Williams',
        eta: toTime(h, m + 9),
        plannedTime: toTime(h, m + 4),
        departedTime: null,
        arrivalStatus: EtaStatus.Late,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 22,
        pickupCount: 8,
        dropoffCount: 14,
        inbound: true,
        schoolId: 1,
      },
      {
        id: '412-1',
        busNumber: '412',
        runId: 1004,
        runName: 'Route D – Downtown',
        driver: 'Susan Davis',
        eta: toTime(h, m - 10),
        plannedTime: toTime(h, m - 10),
        departedTime: toTime(h, m - 8),
        arrivalStatus: EtaStatus.Arrived,
        departureStatus: EtaStatus.Departed,
        studentCount: 15,
        pickupCount: 0,
        dropoffCount: 15,
        inbound: true,
        schoolId: 1,
      },
      {
        id: '518-1',
        busNumber: '518',
        runId: 1005,
        runName: 'Route E – Southside',
        driver: 'Tom Brown',
        eta: null,
        plannedTime: toTime(h, m + 12),
        departedTime: null,
        arrivalStatus: EtaStatus.Unavailable,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 0,
        pickupCount: 0,
        dropoffCount: 20,
        inbound: true,
        schoolId: 1,
      },
      {
        id: '624-1',
        busNumber: '624',
        runId: 1006,
        runName: 'Route F – Central',
        driver: 'Alice Miller',
        eta: toTime(h, m + 5),
        plannedTime: toTime(h, m + 5),
        departedTime: null,
        arrivalStatus: EtaStatus.OnTime,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 19,
        pickupCount: 4,
        dropoffCount: 15,
        inbound: true,
        schoolId: 1,
      },
    ],
    2: [
      {
        id: '102-2',
        busNumber: '102',
        runId: 2001,
        runName: 'Route A – North Ridge',
        driver: 'Carlos Garcia',
        eta: toTime(h, m - 3),
        plannedTime: toTime(h, m + 1),
        departedTime: null,
        arrivalStatus: EtaStatus.Early,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 24,
        pickupCount: 6,
        dropoffCount: 18,
        inbound: true,
        schoolId: 2,
      },
      {
        id: '207-2',
        busNumber: '207',
        runId: 2002,
        runName: 'Route B – Lakeview',
        driver: 'Jennifer Lee',
        eta: toTime(h, m + 2),
        plannedTime: toTime(h, m + 2),
        departedTime: null,
        arrivalStatus: EtaStatus.OnTime,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 16,
        pickupCount: 9,
        dropoffCount: 7,
        inbound: true,
        schoolId: 2,
      },
      {
        id: '314-2',
        busNumber: '314',
        runId: 2003,
        runName: 'Route C – Riverside',
        driver: 'Michael Chen',
        eta: toTime(h, m + 8),
        plannedTime: toTime(h, m + 3),
        departedTime: null,
        arrivalStatus: EtaStatus.Late,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 28,
        pickupCount: 12,
        dropoffCount: 16,
        inbound: true,
        schoolId: 2,
      },
      {
        id: '421-2',
        busNumber: '421',
        runId: 2004,
        runName: 'Route D – Hillcrest',
        driver: 'Patricia Wilson',
        eta: toTime(h, m - 7),
        plannedTime: toTime(h, m - 7),
        departedTime: toTime(h, m - 5),
        arrivalStatus: EtaStatus.Arrived,
        departureStatus: EtaStatus.Departed,
        studentCount: 20,
        pickupCount: 0,
        dropoffCount: 20,
        inbound: true,
        schoolId: 2,
      },
      {
        id: '556-2',
        busNumber: '556',
        runId: 2005,
        runName: 'Route E – Meadowbrook',
        driver: 'David Martinez',
        eta: toTime(h, m + 6),
        plannedTime: toTime(h, m + 7),
        departedTime: null,
        arrivalStatus: EtaStatus.Early,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 11,
        pickupCount: 2,
        dropoffCount: 9,
        inbound: true,
        schoolId: 2,
      },
    ],
    3: [
      {
        id: '103-3',
        busNumber: '103',
        runId: 3001,
        runName: 'Route A – Parkway',
        driver: 'Linda Thompson',
        eta: toTime(h, m + 1),
        plannedTime: toTime(h, m + 1),
        departedTime: null,
        arrivalStatus: EtaStatus.OnTime,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 32,
        pickupCount: 10,
        dropoffCount: 22,
        inbound: true,
        schoolId: 3,
      },
      {
        id: '215-3',
        busNumber: '215',
        runId: 3002,
        runName: 'Route B – Fairview',
        driver: 'Robert Anderson',
        eta: toTime(h, m + 11),
        plannedTime: toTime(h, m + 5),
        departedTime: null,
        arrivalStatus: EtaStatus.Late,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 27,
        pickupCount: 7,
        dropoffCount: 20,
        inbound: true,
        schoolId: 3,
      },
      {
        id: '332-3',
        busNumber: '332',
        runId: 3003,
        runName: 'Route C – Valley',
        driver: 'Karen White',
        eta: toTime(h, m - 4),
        plannedTime: toTime(h, m + 2),
        departedTime: null,
        arrivalStatus: EtaStatus.Early,
        departureStatus: EtaStatus.Unavailable,
        studentCount: 14,
        pickupCount: 3,
        dropoffCount: 11,
        inbound: true,
        schoolId: 3,
      },
      {
        id: '440-3',
        busNumber: '440',
        runId: 3004,
        runName: 'Route D – Summit',
        driver: 'James Harris',
        eta: toTime(h, m - 15),
        plannedTime: toTime(h, m - 15),
        departedTime: toTime(h, m - 12),
        arrivalStatus: EtaStatus.Arrived,
        departureStatus: EtaStatus.Departed,
        studentCount: 22,
        pickupCount: 0,
        dropoffCount: 22,
        inbound: true,
        schoolId: 3,
      },
    ],
  };
}

export function formatTime(date) {
  if (!date) return '--:--';
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function getMinutesDiff(etaDate, plannedDate) {
  if (!etaDate || !plannedDate) return 0;
  return Math.round((etaDate - plannedDate) / 60000);
}

export function simulateUpdate(buses) {
  const next = {};
  for (const schoolId of Object.keys(buses)) {
    next[schoolId] = buses[schoolId].map(bus => {
      if (bus.arrivalStatus === EtaStatus.Arrived || bus.arrivalStatus === EtaStatus.Unavailable) {
        return bus;
      }
      const roll = Math.random();
      if (roll > 0.85) {
        const etaDelta = Math.floor(Math.random() * 5) - 2;
        const newEta = new Date(bus.eta.getTime() + etaDelta * 60000);
        const diff = getMinutesDiff(newEta, bus.plannedTime);
        let newStatus = EtaStatus.OnTime;
        if (diff < -1.5) newStatus = EtaStatus.Early;
        else if (diff > 1.5) newStatus = EtaStatus.Late;
        const changed = newStatus !== bus.arrivalStatus;
        return { ...bus, eta: newEta, arrivalStatus: newStatus, _statusChanged: changed };
      }
      return { ...bus, _statusChanged: false };
    });
  }
  return next;
}
