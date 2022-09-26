import React, {useState} from 'react';
import './App.css';
import UnitsTable, {defaultLocationProps, LocationProps} from "../UnitsTable/UnitsTable";
import UnitsDetailsTable from "../UnitsDetailsTable/UnitDetailsTable";

function App() {

    let defaultUnitProps = {
        id: 0,
        unitName: '',
        unitMacAddress: '',
        locationMap: defaultLocationProps,
        locationList: [defaultLocationProps],
        capacity: 0
    }
    let [unitPropsSelected, setUnitPropsSelected] = useState(defaultUnitProps);
    let [isShowUnitDetails, showUnitDetails] = useState(false);

    return (
        <div className="App">
            <div data-testid="app-div" className="App">
                {!isShowUnitDetails && (<UnitsTable
    onUnitTap={(id: number, unitName: string,
                unitMacAddress: string,
                locationMap: LocationProps,
                locationList: Array<LocationProps>,
                unitCapacity: number
    ) => {

        console.log('locationMap   ',locationMap)

        setUnitPropsSelected({
            id: id,
            unitName: unitName,
            unitMacAddress: unitMacAddress,
            locationMap: locationMap,
            locationList: locationList,
            capacity: unitCapacity
        })
        showUnitDetails(true)
    }}/>)}
                {isShowUnitDetails && (<UnitsDetailsTable
    unitId={unitPropsSelected.id}
    unitName={unitPropsSelected.unitName}
    unitMacAddress={unitPropsSelected.unitMacAddress}
    locationMap={unitPropsSelected.locationMap}
    locationList={unitPropsSelected.locationList}
    capacity={unitPropsSelected.capacity}
    onBackClick={() => {
        showUnitDetails(false)
    }}
    />)}
            </div>
        </div>
    );
}

export default App;
