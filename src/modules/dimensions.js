// vis: 'dimension' in EventVisualization colums/rows/filters
// dim: tracker analytics api dimension/filter id
// header: tracker analytics api header name (query endpoints)

const EVENT_DIMENSIONS = [
    {
        vis: 'ou',
        dim: 'ou',
        header: 'ouname',
    },
    {
        vis: 'eventDate',
        dim: 'EVENT_DATE',
        header: 'eventdate',
    },
    {
        vis: 'enrollmentDate',
        dim: 'ENROLLMENT_DATE',
        header: 'enrollmentdate',
    },
    {
        vis: 'scheduledDate',
        dim: 'SCHEDULED_DATE',
        header: 'scheduleddate',
    },
    {
        vis: 'incidentDate',
        dim: 'INCIDENT_DATE',
        header: 'incidentdate',
    },
    {
        vis: 'lastUpdated',
        dim: 'LAST_UPDATED',
        header: 'lastupdated',
    },
    {
        vis: 'created',
        dim: 'CREATED',
        header: 'created',
    },
    {
        vis: 'completed',
        dim: 'COMPLETED',
        header: 'completed',
    },
    {
        vis: 'eventStatus',
        dim: 'EVENT_STATUS',
        header: 'eventstatus',
    },
    {
        vis: 'programStatus',
        dim: 'PROGRAM_STATUS',
        header: 'programstatus',
    },
    {
        vis: 'enrollmentOu',
        dim: 'ENROLLMENT_OU',
        header: 'enrollmentouname',
    },
    {
        vis: 'createdBy',
        dim: '',
        header: 'createdbydisplayname',
    },
    {
        vis: 'lastUpdatedBy',
        dim: '',
        header: 'lastupdatedbydisplayname',
    },
    {
        vis: 'createdBy',
        dim: '',
        header: 'createdbydisplayname',
    },
]

export const getHeaderByVis = (vis) =>
    EVENT_DIMENSIONS.find((d) => d.vis === vis)?.header
