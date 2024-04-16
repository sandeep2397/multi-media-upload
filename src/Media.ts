export const MediaDefCols = [
  'fullPath',
  'name',
  'Brand',
  'locationName',
  'description',
  'rating',
  'timeCreated',
  'modifiedBy',
  'size',
];

export const MediaListPath = {
  fullPath: {
    id: '$.metadata.fullPath',
    locale: 'fullPath',
    cell: {
      type: 'text',
      dataType: 'string',
    },
  },
  modifiedBy: {
    id: '$.metadata.customMetadata.modifiedBy',
    locale: 'modifiedBy',
    cell: {
      type: 'text',
      dataType: 'string',
    },
  },
  locationName: {
    id: '$.metadata.customMetadata.locationName',
    locale: 'locationName',
    cell: {
      type: 'text',
      dataType: 'string',
    },
  },
  description: {
    id: '$.metadata.customMetadata.description',
    locale: 'description',
    cell: {
      type: 'text',
      dataType: 'string',
    },
  },

  size: {
    id: '$.metadata.size',
    locale: 'size',
    cell: {
      type: 'text',
      dataType: 'string',
    },
  },

  name: {
    id: '$.metadata.name',
    locale: 'name',
    cell: {
      type: 'text',
      dataType: 'string',
    },
  },

  rating: {
    id: '$.metadata.customMetadata.rating',
    locale: 'rating',
    cell: {
      type: 'text',
      dataType: 'string',
    },
  },

  timeCreated: {
    id: '$.metadata.timeCreated',
    locale: 'rating',
    cell: {
      type: 'text',
      dataType: 'string',
    },
  },
};
