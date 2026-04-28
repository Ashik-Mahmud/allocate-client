import React from 'react'

type Props = {}

const StaffMain = (props: Props) => {
    return (
        <div>
            <div className="title">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Staff Management</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Initial page for assigning and managing staff members.</p>
            </div>

            <div className="filter-staff">
                {/* Placeholder for future filter/search functionality */}

            </div>

            <div className="staff-list">
                {/* Placeholder for staff user cards */}
                
            </div>
        </div>
    )
}


export default StaffMain