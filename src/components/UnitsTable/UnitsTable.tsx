import * as React from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useRef, useState} from "react";
import {Button} from "@mui/material";
import {DialogPopup, PopupProps} from "../popup/popup";

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export type LocationProps = {
    id: number,
    address: string,
    macAddress: string
}

type UnitProps = {
    id: number,
    name: string,
    macAddress: string,
    locationId: string,
    locationMap: LocationProps,
    unitCapacity: number
}

export type AddEditUnitProps = {
    unitName: string,
    macAddress: string,
    locationId: number,
    capacity: number
}

export type UnitTableProps = {
    onUnitTap: Function
};

export let defaultLocationProps: LocationProps = {
    id: 0, address: '', macAddress: ''
}

let defaultProp: UnitProps = {
    id: 0, name: "", macAddress: '', locationId: '', locationMap: defaultLocationProps, unitCapacity: 0
}

let unitsData: any[] = []
let isFirstEnter = false;

export default function UnitsTable(props: UnitTableProps) {
    let [unitList, setUnitsLists] = useState([defaultProp]);
    let [locationsList, setLocationsLists] = useState([defaultLocationProps]);
    let [isLoading, setIsLoading] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');

    const childRef = useRef<any>(null);
    const openDialogPopup = (props: PopupProps) => {
        console.log("login button pressed");
        childRef.current?.openDialogPopup(props);
    };

    const fetchLocations = async () => {
        let returnedLocations = await fetch("http://localhost:3001/locations")
        let resultLocations = JSON.parse(await returnedLocations.text())
        console.log('result  ', resultLocations.payload)
        let data: any[] = [];
        resultLocations.payload.map((item: LocationProps, index: number) => {
            data.push(item)
        })
        setLocationsLists([...data])
    }

    const fetchUnits = async () => {
        let returnedUnits = await fetch("http://localhost:3001/units")
        let resultUnits = JSON.parse(await returnedUnits.text())
        unitsData = [];
        resultUnits.payload.map((item: any, index: number) => {
            unitsData.push({
                id: item.id,
                name: item.name,
                macAddress: item.macAddress,
                locationId: item.locationId,
                locationMap: {
                    id: parseInt(item.locationId),
                    address: item.locationAddress,
                    macAddress: item.locationMacAddress,
                },
                unitCapacity: item.unitCapacity
            })
        })
        addUnitToUnitList(unitsData)
    }

    function addUnitToUnitList(list: any[]) {
        setUnitsLists([...list])
    }

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            /// get all location lists
            await fetchLocations();

            /// get all units
            await fetchUnits();
            isFirstEnter = true
        } catch (e) {
            setIsLoading(false);
            setErrorMessage('Error is ' + e);
        }
    }

    const addUnitData = async (addUnitProps: AddEditUnitProps) => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            let returnedUnits = await fetch(
                "http://localhost:3001/units",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'name': addUnitProps.unitName,
                        'macAddress': addUnitProps.macAddress,
                        'capacity': addUnitProps.capacity,
                        "locationId": addUnitProps.locationId
                    }),
                })
            let resultUnits = JSON.parse(await returnedUnits.text())
            console.log('result  ', resultUnits.payload)

            const locationModel = locationsList.find((obj) => {
                return obj.id === resultUnits.payload.locationId;
            });

            if (locationModel !== undefined) {
                unitList.push({
                    id: resultUnits.payload.id,
                    name: resultUnits.payload.name,
                    macAddress: resultUnits.payload.macAddress,
                    locationId: resultUnits.payload.locationId,
                    locationMap: locationModel,
                    unitCapacity: resultUnits.payload.capacity
                })
                addUnitToUnitList(unitList)
            }
        } catch (e) {
            setIsLoading(false);
            setErrorMessage('Error is ' + e);
        }
    }

    useEffect(() => {
        fetchData().then()
    }, [])

    return (
        <TableContainer component={Paper}>
            {errorMessage !== "" && (<div style={{color: "red"}}>Error in fetching your data, please try again with good network!!!</div>)}
            <div style={{width: "95%", margin: "20px", display: "flex", justifyContent: "space-between"}}>
                <span>Unitssssss Updated</span>
                <Button style={{backgroundColor: "#d0f9fa"}}
                        onClick={() => {
                            setErrorMessage('');
                            openDialogPopup({
                                unitName: '',
                                macAddress: "",
                                locationMap: defaultLocationProps,
                                locationList: locationsList,
                                capacity: 0,
                                onSubmit: (addUnitProps: AddEditUnitProps) => addUnitData(addUnitProps)
                            })
                        }}>+ Add Unit</Button>
            </div>
            <Table sx={{minWidth: 500, margin: "20px", width: "95%"}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align="right">LOCATION ADDRESS</StyledTableCell>
                        <StyledTableCell align="right">UNIT CAPACITY</StyledTableCell>
                        <StyledTableCell align="right">ACTION</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {unitList.map((row, index) => (
                        <StyledTableRow key={index} onClick={() =>
                            props.onUnitTap(row.id, row.name, row.macAddress, row.locationMap, locationsList, row.unitCapacity)}
                                        style={{cursor: "pointer"}}>
                            <StyledTableCell component="th" scope="row">{row.id}</StyledTableCell>
                            <StyledTableCell align="right">{row.locationMap.address}</StyledTableCell>
                            <StyledTableCell align="right">{row.unitCapacity}</StyledTableCell>
                            <StyledTableCell align="right"><Button>...</Button></StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <DialogPopup ref={childRef!}/>
        </TableContainer>
    );
}

