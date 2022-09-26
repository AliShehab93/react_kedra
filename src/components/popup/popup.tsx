import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import {useImperativeHandle, useState} from "react";
import {FormControl, Input, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {defaultLocationProps, LocationProps} from "../UnitsTable/UnitsTable";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface PopupProps {
    unitName: string,
    macAddress: string,
    locationMap: LocationProps,
    locationList: Array<LocationProps>,
    capacity: number,
    onSubmit: Function
}

export const DialogPopup = React.forwardRef((unusedProps, ref) => {
    const [open, setOpen] = React.useState(false);
    const [unitName, setUnitName] = useState('');
    const [macAddress, setMacAddress] = useState('');
    const [locationMap, setLocationMap] = useState<LocationProps>(defaultLocationProps);
    const [capacity, setCapacity] = useState(0);
    const [locationList, setLocationList] = useState([defaultLocationProps]);


    let defaultProps = {
        unitName: '',
        macAddress: '',
        locationMap: {
            id: 0,
            macAddress: "",
            address: ''
        },
        locationList: [],
        capacity: 0,
        onSubmit: Function
    }

    const [popupProps, setPopupProps] = React.useState<PopupProps>(defaultProps);

    useImperativeHandle(ref, () => ({
        // this is to open lots modal popup
        openDialogPopup(props: PopupProps) {
            setOpen(true);

            setUnitName(props.unitName);
            setMacAddress(props.macAddress);
            setLocationMap(props.locationMap);
            setCapacity(props.capacity);
            setLocationList(props.locationList);

            setPopupProps(props);
        },
    }));

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        console.log('handleSubmit ran');
        event.preventDefault(); // 👈️ prevent page refresh

        // 👇️ access input values here
        console.log('sd 👉️',
            {
            unitName: unitName,
            macAddress: macAddress,
            locationMap: locationMap,
            capacity: capacity,
        });

        popupProps.onSubmit({
            unitName: unitName,
            macAddress: macAddress,
            locationId: locationMap,
            capacity: capacity,
        })

        handleClose();
        setUnitName('');
        setMacAddress('');
        setLocationMap(defaultLocationProps);
        setCapacity(0);
        setLocationList([]);
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="Add Unit">
                <DialogTitle>{popupProps.unitName === '' ? "Add" : "Edit"} Unit</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}
                          style={{justifyContent: "center", width: "500px"}}>
                        <div style={{padding: "10px"}}>
                            <TextField
                                fullWidth
                                id="unitName"
                                name="Unit Name"
                                type="text"
                                label={'Unit Name'}
                                placeholder={'Unit Name'}
                                onChange={event => setUnitName(event.target.value)}
                                value={unitName}
                            />
                        </div>
                        <div style={{padding: "10px"}}>
                            <TextField
                                fullWidth
                                id="macAddress"
                                name="Mac Address"
                                type="text"
                                label={'Mac Address'}
                                placeholder={'Mac Address'}
                                value={macAddress}
                                onChange={event => setMacAddress(event.target.value)}
                            />
                        </div>
                        <div style={{padding: "10px"}}>
                            <FormControl fullWidth>
                                {locationMap.address}
                                <InputLabel id="demo-simple-select-label">Location Address</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label={'Location Address'}
                                    placeholder={'Location Address'}
                                    value={locationMap}
                                    onChange={(event: any) => setLocationMap(event.target.value)}>
                                    {locationList.map((row, index) => (
                                        <MenuItem key={index} value={row.id}>{row.address}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{padding: "10px"}}>
                            {capacity}
                            <TextField
                                fullWidth
                                id="capacity"
                                name="Capacity"
                                type="number"
                                InputProps={{ inputProps: { min: 0, max: 4 } }}
                                label={'Capacity'}
                                placeholder={'Capacity'}
                                value={capacity}
                                onChange={event => setCapacity(Number(event.target.value))}
                            />
                        </div>
                        <Button type="submit" sx={{alignSelf: "end"}}>Submit form</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
});
