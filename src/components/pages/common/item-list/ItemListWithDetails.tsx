import { useState, useEffect, useRef, useReducer, Reducer, useContext } from 'react';
import { IonLabel } from '@ionic/react';
import { Item } from "../item/Item";
import { Loading } from "../Loading"
import { ColumnProps } from "../../../types/ColumnProps";
import { Model } from "../../../models/Model"
import { AppContext } from '../../../contexts/AppContext'; 
import { ItemListPropsWithDetails } from '../../../types/ItemListProps';
import { ItemListChild } from './ItemListChild';
import { ItemList } from './ItemList';
import { chevronDown, chevronForward } from 'ionicons/icons';
import "./ItemList.scss";

export const ItemListWithDetails = <T extends Model, D1 extends Model = {}, D2 extends Model = {}, T1 extends Model = T> ({    
    details,
    getModel,
    xModel,
    selected,
    ...props
} : ItemListPropsWithDetails<T, D1, D2, T1>) => {
    const { fetchApi, setToken } = useContext(AppContext);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [data, setData] = useReducer<Reducer<Array<D1> | undefined, Array<D1> | undefined>>((_, newValue) => {
        if (!!newValue) {
            xModel.current = getModel ? getModel(xModel.current, newValue) : xModel.current;
            showLoading && setShowLoading(false);
        }
        return newValue;
    }, !details?.fetchApiOptions ? [] : details?.data);
    const [showDetails, setShowDetails] = useReducer<Reducer<boolean, boolean>>((_, newValue) => {
        !!newValue && !showLoading && !data && setShowLoading(true);
        return newValue; 
    }, false);
    const DetailItem = ({model, fields, position}: {
        model: D1, 
        fields: ColumnProps<D1, T>[],
        position: number
    }) => {
        const item = useRef<D1>(model);
        return (
            <Item<D1, T>
                fields={fields}
                itemProps={{className: "ion-detail-item ion-margin-top", detail: false, color: 'light'}} 
                Children={(col) => <ItemListChild<D1, T> {...col} {...props} onClick={() => {}} model={xModel} xModel={item} position={position}  /> }
            />
        );
    };
    useEffect(() => {
        if (!showDetails || !!data) return;
        if (!data && details?.fetchApiOptions) {
            fetchApi(details.fetchApiOptions(xModel.current)).then((result) => {
                if (result?.error?.status === 401) setToken(null) //Unauthorized
                else setData(result?.response.Data || []);
                return () => {
                    result = null;
                    
                };
            });
        }
    }, [
        data, 
        details, 
        showDetails, 
        fetchApi,
        xModel,
        setToken
    ]);
    return (
        <>
            <Loading isOpen={showLoading} />
            <ItemList<T, T1> 
                {...props} 
                itemProps={{detail: true, detailIcon: showDetails ? chevronDown : chevronForward}}
                onClick={() => setShowDetails(!showDetails)}
                xModel={xModel} selected={selected}>
                {data && showDetails &&
                    <>
                        <IonLabel className="ion-align-self-end">
                            <small><b>{data.length}</b><span>{data.length === 1 ? " Item" : " Itens"}</span></small>
                        </IonLabel>
                        <Item<D1, T>
                            fields={details.columns}
                            itemProps={{color: "light"}}
                            colProps={{className: "ion-text-center" }}
                            Children={(col) => <h6>{col.label}</h6>} 
                        />
                        {data.length
                            ? data.map((row, index) => <DetailItem model={row} key={index} fields={details.columns} position={index} />) 
                            : <small className="sem-resultados">Sem resultados...</small>
                        }
                    </>
                }
            </ItemList>
        </>
    );
}