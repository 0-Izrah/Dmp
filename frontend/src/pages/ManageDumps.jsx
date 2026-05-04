import { useMyDumps } from '../hooks/useDumps';
import DashboardStats from '../components/Manage/DashboardStats';
import DumpList from '../components/Manage/DumpList';
import DumpForm from '../components/Manage/DumpForm';

export default function ManageDumps (){
    const { dumps , loading , error } = useMyDumps();

    if(loading) return <div>loading dashboard...</div>;
    if(error) return <div>Error Loading Data...</div>;

    return (
        <div className="manage-dashboard">
            <DashboardStats dumps={dumps} />
            <div className='manage-header'>
                <h2>Your Dumps</h2>
                <DumpForm />{/* A modal or slide-down form to create new dumps */}
            </div>
            <DumpList dumps={dumps} />
        </div>
    )
}