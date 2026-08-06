import reportFields from "../../../constants/reportFields";

export default function TableSettings({

    visibleColumns,

    setVisibleColumns,

}) {

    function toggle(key){

        setVisibleColumns(prev=>({

            ...prev,

            [key]:!prev[key],

        }));

    }

    return (

        <div className="table-settings">

            <h3>⚙ Table Columns</h3>

            {reportFields
            .filter(field=>field.showInTable)
            .map(field=>(

                <label key={field.key}>

                    <input

                        type="checkbox"

                        checked={visibleColumns[field.key]}

                        onChange={()=>toggle(field.key)}

                    />

                    {field.label}

                </label>

            ))}

        </div>

    );

}