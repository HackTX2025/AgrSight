module.exports = {
  farm: {
    id: 'kansas-demo-farm',
    name: 'Demo Kansas Farm',
    center: { lat: 38.358, lng: -98.957 }, // Center of the three fields
    fields: [
      {
        id: 'field-1',
        name: 'North Field',
        coordinates: { lat: 38.358, lng: -98.972 }, // 38°21'30"N 98°58'20"W
        area_acres: 48,
        crop_type: 'wheat',
        image_path: 'field1.jpg',
        status: null,
        health_condition: 'medium' // Mixed green and dry land
      },
      {
        id: 'field-2',
        name: 'East Field',
        coordinates: { lat: 38.358, lng: -98.926 }, // 38°21'28"N 98°55'34"W
        area_acres: 54,
        crop_type: 'corn',
        image_path: 'field2.jpg',
        status: null,
        health_condition: 'good' // All green land
      },
      {
        id: 'field-3',
        name: 'South Field',
        coordinates: { lat: 38.344, lng: -98.951 }, // 38°20'38"N 98°57'05"W
        area_acres: 43,
        crop_type: 'soybeans',
        image_path: 'field3.jpg',
        status: null,
        health_condition: 'poor' // Mainly dry land
      }
    ]
  }
};
