const thefunc=(passedfunc)=>(req,res,next)=>{
    Promise.resolve(passedfunc(req,res,next)).catch(next);
}

export default thefunc;

// export const thefunc =()=>{
//     return ()=>{
           // same as the below one 
//     }
// }

// export const thefunc=()=>()=>{
       // function returning a function 
// }