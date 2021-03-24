import React, { ComponentType } from 'react';
import {
    RouteComponentProps as RP
  } from "react-router";

import { InternalDocument } from '../../../models/InternalDocument';
import { DocumentFormProps } from '../../../types/DocumentFormProps';
import { DocumentForm } from "../DocumentForm"

export const InternalDocumentForm: ComponentType<DocumentFormProps<InternalDocument> & RP<any>> = props => (
    <DocumentForm<InternalDocument> 
        {...props}
        key={props.keyId}
        extended={{
            dataField: "DataDoc",
            routeUpdate: "document/create",
            title: "Registo de Despesa"
        }}
    />
);