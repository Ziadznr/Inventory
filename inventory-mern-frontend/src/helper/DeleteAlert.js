import Swal from "sweetalert2"

export async function DeleteAlert(){
    let Result=await Swal.fire({
        allowOutsideClick:false,
        title: 'Are You Sure?',
        text: "You won't be able to revert this!",
        icon:'warning',
        showCancelButton:true,
        confirmButtonColor:'#3o85d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Yes, delete it!',

    })

    return Result;
}