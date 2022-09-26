import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useRef, useState} from "react";
import {Button} from "@mui/material";
import {DialogPopup, PopupProps} from "../popup/popup";
import {AddEditUnitProps, defaultLocationProps, LocationProps} from "../UnitsTable/UnitsTable";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

type CompartmentProps = {
    id: number,
    numberOfPackages: number,
    macAddress: string,
    unitId: number
};

export type UnitsDetailsProps = {
    unitId: number,
    unitName: string,
    unitMacAddress: string,
    locationMap: LocationProps,
    locationList: Array<LocationProps>,
    capacity: number,
    onBackClick: Function
};

export default function UnitsDetailsTable(props: UnitsDetailsProps) {
    const childRef = useRef<any>(null);
    const openDialogPopup = (props: PopupProps) => {
        console.log("login button pressed");
        console.log("props ",props);
        childRef.current?.openDialogPopup(props);
    };

    let defaultProp: CompartmentProps = {
        id: 0, numberOfPackages: 0, macAddress: "", unitId: 0
    }
    let [compartmentList, setCompartmentLists] = useState([defaultProp]);
    let [isLoading, setIsLoading] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            const data : CompartmentProps[] = [
                {id: 0, numberOfPackages: 0, macAddress: "df", unitId: 0},
                {id: 0, numberOfPackages: 0, macAddress: "d", unitId: 0},
                {id: 0, numberOfPackages: 0, macAddress: "df", unitId: 0},
            ];

            // const response = await fetch("https://jsonplaceholder.typicode.com/users")
            // const data = await response.json()
            await setCompartmentLists(data)
        } catch (e) {
            setIsLoading(false);
            setErrorMessage('Error is '+e);
        }
    }

    const editUnitData = async (editUnitProps: AddEditUnitProps) => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            let editMap = {
                'name': editUnitProps.unitName,
                'macAddress': editUnitProps.macAddress,
                'capacity': editUnitProps.capacity,
                'locationId': editUnitProps.locationId
            }
            console.log(editMap)

            let returnedUnits = await fetch(
                "http://localhost:3001/units/"+props.unitId,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editMap),
                })
            let resultUnits = JSON.parse(await returnedUnits.text())
            console.log('result  ', resultUnits.payload)

            const locationModel = props.locationList.find((obj) => {
                return obj.id === editUnitProps.locationId;
            });

            if(locationModel !== undefined) {
                props.unitId = resultUnits.payload.id
                props.unitName = resultUnits.payload.name
                props.unitMacAddress = resultUnits.payload.macAddress
                props.locationMap = locationModel
            }

        } catch (e) {
            setIsLoading(false);
            setErrorMessage('Error is ' + e);
        }
    }

    useEffect( () => {
        fetchData().then()
    }, [])

    return (
        <TableContainer component={Paper}>
            <div style={{width: "95%", margin: "20px", display: "flex",  justifyContent: "start"}}>
                <Button onClick={() => props.onBackClick()} > {'< Details'}</Button>
            </div>
            <div style={{width: "95%", margin: "20px", display: "flex", justifyContent: "space-between"}}>
                <div>
                    <div>Unit Id       : {props.unitId}</div>
                    <div>Unit name     : {props.unitName}</div>
                    <div>Unit macAd    : {props.unitMacAddress}</div>
                    <div>Unit localtion: {props.locationMap.address}</div>
                </div>
                <Button style={{backgroundColor: "#d0f9fa", height: "40px"}}
                        onClick={() => openDialogPopup({
                            unitName: props.unitName,
                            macAddress: props.unitMacAddress,
                            locationMap: props.locationMap,
                            locationList: props.locationList,
                            capacity: props.capacity,
                            onSubmit: (addUnitProps: AddEditUnitProps) => editUnitData(addUnitProps)
                        })}
                >Edit Unit</Button>
            </div>
            <Table sx={{ minWidth: 500 , margin: "20px", width: "95%"}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Compartment Id</StyledTableCell>
                        <StyledTableCell align="right"># of packages</StyledTableCell>
                        <StyledTableCell align="right">cell MAC address</StyledTableCell>
                        <StyledTableCell align="right">{}</StyledTableCell>
                        <StyledTableCell align="right">{}</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {compartmentList.map((row, index) => (
                        <StyledTableRow key={index} style={{cursor: "pointer"}}>
                            <StyledTableCell component="th" scope="row">{row.id}</StyledTableCell>
                            <StyledTableCell align="right">{row.numberOfPackages}</StyledTableCell>
                            <StyledTableCell align="right">{row.macAddress}</StyledTableCell>
                            <StyledTableCell align="right"><Button>Edit</Button></StyledTableCell>
                            <StyledTableCell align="right"><Button>Delete</Button></StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <DialogPopup ref={childRef!} />
        </TableContainer>
    );
}

