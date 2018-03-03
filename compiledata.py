#!/usr/bin/env python3

import sys
from pathlib import Path
import subprocess
import tempfile


LAYERS = ['batalii', 'granite_last']
REPO = Path(__file__).resolve().parent


def spatialite_layer_to_json(db, layer, json_out):
    subprocess.run([
        'ogr2ogr',
        '-f', 'GeoJSON',
        '-dialect', 'SQLite',
        json_out,
        db, layer,
    ], check=True)


def geojsons_to_topojson(out, json_list):
    geo2topo = REPO / 'node_modules/.bin/geo2topo'
    cmd = [geo2topo, '-q', '1e4', '-o', out] + json_list
    subprocess.run(cmd, check=True)


def main():
    [db] = sys.argv[1:]
    with tempfile.TemporaryDirectory() as tmp_string:
        tmp = Path(tmp_string)
        json_list = []
        for layer in LAYERS:
            json_out = tmp / f'{layer}.geojson'
            spatialite_layer_to_json(db, layer, json_out)
            json_list.append(json_out)

        geojsons_to_topojson(REPO / 'vectori.topojson', json_list)


if __name__ == '__main__':
    main()
