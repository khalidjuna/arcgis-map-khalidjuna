import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Core
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";

// Widgets
import Zoom from "@arcgis/core/widgets/Zoom";
import Compass from "@arcgis/core/widgets/Compass";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Legend from "@arcgis/core/widgets/Legend";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Measurement from "@arcgis/core/widgets/Measurement";
import Print from "@arcgis/core/widgets/Print";

function App() {
  const mapDiv = useRef(null);
  const [margin, setMargin] = useState(5); // Initial margin is 5 line
  const [gridSpace, setGridSpace] = useState(1); // Initial grid space is 1 km
  const [points, setPoint] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await axios
        .get("http://localhost:8080/api/points", {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE2ODk2NTU5LCJleHAiOjE3MTY5MDAxNTl9.MiLsyI08GtO6hwd5GahUvYFCQUxNL47RM3s8RGKsUko",
          },
        })
        .then((res) => res.data);
      console.log({ result });
      setPoint(result.points);
    })();
  }, []);

  useEffect(() => {
    if (mapDiv.current) {
      const webMap = new WebMap({
        // basemap: 'streets-navigation-vector',
        basemap: "topo-vector",
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webMap,
        center: [106.0672384, -6.123776753], // Center the map to one of the points
        zoom: 10,
      });
      view.popup.defaultPopupTemplateEnabled = true;
      view.popup.dockEnabled = false;
      view.popup.autoOpenEnabled = true;

      // Add Compass widget
      const compass = new Compass({
        view: view,
      });
      view.ui.add(compass, "top-left");

      // Add ScaleBar widget
      const scaleBar = new ScaleBar({
        view: view,
        unit: "dual", // Use both metric and non-metric units
      });
      view.ui.add(scaleBar, "bottom-right");

      // Add Measurement widget
      const measurement = new Measurement({
        view: view,
      });
      view.ui.add(measurement, "bottom-right");

      // // Add BasemapGallery widget
      // const basemapGallery = new BasemapGallery({
      //   view: view,
      // });
      // view.ui.add(basemapGallery, 'bottom-right');

      // // Add Print widget
      // const print = new Print({
      //   view: view,
      //   printServiceUrl: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
      // });
      // view.ui.add(print, 'bottom-right');

      // -----------------------------------------------------

      // Find the maximum and minimum X and Y coordinates
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      points.forEach((point) => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });

      // Create grid lines
      const gridSize = gridSpace / 100; // km

      // Add margin of 5 grid lines
      const marginSize = margin * gridSize; // Convert margin to kilometers
      minX -= marginSize;
      minY -= marginSize;
      maxX += marginSize;
      maxY += marginSize;

      const gridLines = [];
      for (let x = minX; x <= maxX; x += gridSize) {
        const line = new Polyline({
          paths: [
            [x, minY],
            [x, maxY],
          ],
        });
        gridLines.push(line);
      }
      for (let y = minY; y <= maxY; y += gridSize) {
        const line = new Polyline({
          paths: [
            [minX, y],
            [maxX, y],
          ],
        });
        gridLines.push(line);
      }

      gridLines.forEach((line) => {
        const graphicLine = new Graphic({
          geometry: line,
          symbol: {
            type: "simple-line",
            color: [0, 0, 0, 0.15],
            width: 1,
          },
        });
        view.graphics.add(graphicLine);
      });

      // -----------------------------------------------------

      points.forEach((point) => {
        const graphicPoint = new Graphic({
          geometry: new Point({
            longitude: point.x,
            latitude: point.y,
          }),
          symbol: {
            type: "simple-marker",
            color: "blue",
            size: "12px",
            outline: {
              color: "white",
              width: 1,
            },
          },
          attributes: point,
          popupTemplate: {
            title: "Point Information",
            content: `
                <ul>
                  <li><b>X:</b> {x}</li>
                  <li><b>Y:</b> {y}</li>
                  <li><b>Ratio:</b> {ratio}</li>
                  <li><b>Orientation:</b> {orientation}</li>
                </ul>
              `,
            location: "auto",
          },
        });

        const length = 0.01; // Length of the line, can be adjusted
        const angleRad = point.orientation * (Math.PI / 180); // Convert angle to radians
        const offsetX = length * Math.cos(angleRad);
        const offsetY = length * Math.sin(angleRad);

        const polyline = new Polyline({
          paths: [
            [point.x - offsetX, point.y - offsetY], // Start point (adjusted for center)
            [point.x + offsetX, point.y + offsetY], // End point (adjusted for center)
          ],
        });

        const graphicLine = new Graphic({
          geometry: polyline,
          symbol: {
            type: "simple-line",
            color: "red",
            width: 2,
          },
        });

        view.graphics.add(graphicPoint);
        view.graphics.add(graphicLine);
      });

      return () => {
        if (view) {
          view.container = null;
        }
      };
    }
  }, [points, margin, gridSpace]); // Re-render when value changes

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: "9999",
        }}
      >
        <div
          style={{
            textAlign: "right",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <span style={{ marginRight: "10px" }}>Margin Grid :</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setMargin((prev) => prev - 1)}
          >
            -
          </button>
          <span style={{ margin: "0 10px" }}>{margin} line</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setMargin((prev) => prev + 1)}
          >
            +
          </button>
        </div>
        <div
          style={{
            textAlign: "right",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <span style={{ marginRight: "10px" }}>Space Grid :</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setGridSpace((prev) => prev - 1)}
          >
            -
          </button>
          <span style={{ margin: "0 10px" }}>{gridSpace} km</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setGridSpace((prev) => prev + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div
        style={{
          height: "100vh",
          width: "100%",
          position: "relative",
          zIndex: "1",
        }}
        ref={mapDiv}
      ></div>
    </div>
  );
}

export default App;
