// Fallback India states data for when external topojson is unavailable
export const indiaStatesFallback = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { ST_NM: "Rajasthan", name: "Rajasthan" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.48, 23.45], [74.42, 23.45], [74.42, 30.12], [69.48, 30.12], [69.48, 23.45]
        ]]
      }
    },
    {
      type: "Feature", 
      properties: { ST_NM: "Gujarat", name: "Gujarat" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.15, 20.18], [74.42, 20.18], [74.42, 24.71], [68.15, 24.71], [68.15, 20.18]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ST_NM: "Maharashtra", name: "Maharashtra" },
      geometry: {
        type: "Polygon", 
        coordinates: [[
          [72.65, 15.64], [80.89, 15.64], [80.89, 22.03], [72.65, 22.03], [72.65, 15.64]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ST_NM: "Kerala", name: "Kerala" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [74.86, 8.29], [77.41, 8.29], [77.41, 12.79], [74.86, 12.79], [74.86, 8.29]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ST_NM: "Karnataka", name: "Karnataka" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [74.12, 11.59], [78.59, 11.59], [78.59, 18.48], [74.12, 18.48], [74.12, 11.59]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ST_NM: "Tamil Nadu", name: "Tamil Nadu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.23, 8.08], [80.35, 8.08], [80.35, 13.83], [76.23, 13.83], [76.23, 8.08]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ST_NM: "Uttar Pradesh", name: "Uttar Pradesh" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.09, 23.87], [84.64, 23.87], [84.64, 30.42], [77.09, 30.42], [77.09, 23.87]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ST_NM: "Punjab", name: "Punjab" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [73.87, 29.53], [76.58, 29.53], [76.58, 32.52], [73.87, 32.52], [73.87, 29.53]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ST_NM: "West Bengal", name: "West Bengal" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [85.82, 21.94], [89.88, 21.94], [89.88, 27.14], [85.82, 27.14], [85.82, 21.94]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ST_NM: "Delhi", name: "Delhi" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.84, 28.40], [77.34, 28.40], [77.34, 28.88], [76.84, 28.88], [76.84, 28.40]
        ]]
      }
    }
  ]
}