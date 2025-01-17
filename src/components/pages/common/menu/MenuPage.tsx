import { ComponentProps, ComponentType, FunctionComponent, useContext, useEffect } from "react";
import {
    IonContent,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonImg,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonPage,
    IonButtons,
    IonMenuButton,
    IonListHeader,
    IonItemDivider,
    IonSplitPane,
    IonRouterOutlet,
  } from '@ionic/react';
  import { arrowBack } from 'ionicons/icons';
import { MenuItemProps } from "../../../types/MenuItemProps";
import logoMenu from "../../../../assets/img/logo74.png"
import { Button } from "../buttons/Button";
import { AppContext } from "../../../contexts/AppContext";
import { logOut, archive, card } from 'ionicons/icons';
import { Redirect, Route } from "react-router";
import Login from "../../auth/Login";
import Logout from "../../auth/Logout";
import PurchaseDocumentList from "../../documents/purchase/PurchaseDocumentList";
import InternalDocumentList from "../../documents/internal/InternalDocumentList";
import InternalDocumentForm from "../../documents/internal/InternalDocumentForm";
import PurchaseDocumentForm from "../../documents/purchase/PurchaseDocumentForm";

export const MenuPage: FunctionComponent = (props) => {
    useEffect(() => console.log(props), [props])
    const {token, employee, history} = useContext(AppContext);
    const menuProps: ComponentProps<typeof IonMenu> = {
        menuId: "main-menu", 
        contentId: "content-pane", 
        type: "overlay", 
        disabled: !token,
      };
    const sideMenu: Array<{
      header?: string;
      items: Array<MenuItemProps>;
    }> = [{
        header: "Documentos",
        items: [{
          routerLink: "/encomendas/all",
          routerDirection: "root",
          title: "Encomendas",
          icon: {
            icon: archive,
          }
        }, {
          routerLink: "/despesas/all",
          routerDirection: "root",
          title: "Despesas",
          icon: {
            icon: card,
          }
        },
      ]}, {
        header: "Registar ou Alterar",
        items: [{
          routerLink: "/encomendas/form",
          routerDirection: "root",
          title: "Registo de Encomenda",
          icon: {
            icon: archive,
          }
        }, {
          routerLink: "/despesas/form",
          routerDirection: "root",
          title: "Registo de Despesa",
          icon: {
            icon: card,
          }
        }
      ]}, {
        header: employee?.Nome,
        items: [{
          routerLink: "/logout",
          routerDirection: "root",
          title: "Terminar sessão",
          icon: {
            icon: logOut,
          },
        }]
      }
    ];
    return (
      <IonSplitPane contentId={menuProps.contentId} when="">
        <IonMenu {...menuProps}>
          <IonHeader>
            <IonItem id="headerMenu" lines="none">
              <IonImg src={logoMenu}/>
            </IonItem>
          </IonHeader>
          <IonContent>
            {sideMenu.map((item, index) =>
              <div key={index}> 
                <IonListHeader>
                  <small className="ion-text-uppercase">{item.header}</small>
                </IonListHeader>
                <IonList>
                  {item.items.map((menuItemProps, index) =>
                    <MenuItem key={index} {...menuItemProps} />
                  )}
                </IonList>
              </div>
            )}
          </IonContent> 
        </IonMenu>
        <IonPage id={menuProps.contentId}>
          <IonHeader className="main-header ion-no-border">
            <IonToolbar>
              <IonButtons className="ion-margin-start" slot="start">
                <IonMenuButton 
                  menu={menuProps.menuId} 
                  color="primary" 
                  autoHide />
                <Button
                  icon={{
                      icon: arrowBack,
                      color: "primary",
                  }}
                  button={{
                      fill: "clear",
                      slot: "start", 
                      onClick: () => history.goBack(),
                  }}
                  visible={history?.location.pathname !== "/login"} />
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonRouterOutlet id="content-pane">
            <Redirect exact from="/" to={token ? "/encomendas/all" : "/login"} />
            <Route path="/login" render={(props) => token 
              ? <Redirect to="/encomendas/all"/>
              : <Login {...props} /> 
            } />
            <Route path="/logout" render={(props) => !token 
              ? <Redirect to="/login"/>
              : <Logout {...props} /> 
            } />
            <Route path="/encomendas/all" render={(props) => !token 
              ? <Redirect to="/login"/>
              : <PurchaseDocumentList {...props} /> 
            } />
            <Route path="/despesas/all" render={(props) => !token 
              ? <Redirect to="/login"/>
              : <InternalDocumentList {...props} /> 
            } />
            <Route path="/encomendas/form" render={(props) => !token 
              ? <Redirect to="/login"/>
              : <PurchaseDocumentForm {...props} /> 
            } />
            <Route path="/despesas/form" render={(props) => !token 
              ? <Redirect to="/login"/>
              : <InternalDocumentForm {...props} /> 
            } />
          </IonRouterOutlet>
        </IonPage>
      </IonSplitPane>
    );
  };
  const MenuItem = ({ subItems, ...props } : MenuItemProps) => {
    const ItemChild: ComponentType<MenuItemProps> = ({ icon, title }) => (
      <>
        {icon && <IonIcon {...icon} slot="start" />}
        <IonLabel className="menu-item-text">
          {title}
        </IonLabel>
      </>
    );
    const Item: ComponentType<MenuItemProps> = (menuItemProps) => (
      <IonItem {...menuItemProps}>
        <ItemChild {...menuItemProps} />
      </IonItem>
    );
    return (
      <>
        {subItems ?
          <IonList>
            <IonItemDivider>
              <ItemChild {...props} />
            </IonItemDivider>
            {subItems.map((subMenuItemProps, index) => (
              <Item key={index} className="sub-menu-item" {...subMenuItemProps} />
            ))}
          </IonList>
          : <Item {...props} />
        }
      </>
    );
  };