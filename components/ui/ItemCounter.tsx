import { FC } from "react"
import { Box, IconButton, Typography } from "@mui/material"
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"

interface Props {
  quantity: number;
  onQuantityUpdate: (newQuantity: number) => void;
  maxValue: number;
}


export const ItemCounter: FC<Props> = ({ quantity, onQuantityUpdate, maxValue }) => {
  
  const substractQuantity = () => {
    if (quantity > 1) {
      onQuantityUpdate(quantity - 1);
    }
  }
  
  const addQuantity = () => {
    if (quantity < maxValue) {
      onQuantityUpdate(quantity + 1);
    }
  }

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={ substractQuantity }>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>{ quantity }</Typography>
      <IconButton onClick={ addQuantity }>
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
