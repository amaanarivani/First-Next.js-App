'use client'

import Link from "next/link";
import Swal from "sweetalert2";

const UserAuth = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(
    );

    useEffect(() => {
        setCurrentUser(JSON.parse(sessionStorage.getItem('user')))
    },[]);
    
    console.log(currentUser);
    if (currentUser) {
        return children;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'oops!!',
            text: 'Please Login to continue.'
          })
    }

    return <Link href='/login' />
}

export default UserAuth;

