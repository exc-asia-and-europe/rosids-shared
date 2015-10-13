xquery version "3.0";

module namespace app="http://github.com/hra-team/rosids-shared/config/app";

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: Global settings :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

(: Enable debugging in xqueries :)
declare variable $app:debug as xs:boolean := true();

declare variable $app:db as xs:string := "/db/";
declare %private variable $app:data-dir as xs:string := "/db/data/";


declare  %private variable $app:shared-dir as xs:string := "/apps/rosids-shared";
declare  %private variable $app:ziziphus-dir as xs:string := "/apps/ziziphus";


(: Name of imagerecord collection :)
declare variable $app:image-record-dir-name as xs:string := "VRA_images/";
declare %private variable $app:common-data-dir as xs:string := $app:data-dir || "commons/";
declare %private variable $app:users-data-dir as xs:string := $app:data-dir || "users/";


(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: Services settings :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

declare  %private variable $app:service-dir as xs:string := "/apps/rosids-services";

(: data collection :)
declare %private variable $app:repositories-collection := "/data/services/repositories/";

(: Remote setting :)
declare variable $app:service-host := "localhost";
declare variable $app:service-port := "8080";
declare variable $app:remote-service-collection := "xmldb:exist://" || $app:service-host || ":" || $app:service-port || "/exist/xmlrpc/db/";



(: collection paths and configurations for EXC repositories :)
declare %private variable $app:global-repositories-collection := $app:repositories-collection || "global/";


(:  Default group for repositories :)
declare %private variable $app:default-repositories-group := "biblio.users";
declare %private variable $app:default-repositories-collection := $app:repositories-collection || "local/groups/" || $app:default-repositories-group || "/";

(: persons :)
declare %private variable $app:global-persons-repositories-collection := $app:default-repositories-collection || "persons/";
declare variable $app:global-persons-repositories-configuration := <repository name="Persons EXC" authority="local" source="EXC" icon="local"/>;

(: organisations :)
declare %private variable $app:global-organisations-repositories-collection := $app:default-repositories-collection || "organisations/";
declare variable $app:global-organisations-repositories-configuration := <repository name="Organisations EXC" authority="local" source="EXC" icon="local"/>;

(: geographic :)
declare %private variable $app:global-locations-repositories-collection := $app:default-repositories-collection || "locations/";
declare variable $app:global-locations-repositories-configuration := <repository name="Subjects EXC" authority="local" source="EXC" icon="local"/>;

(: subjects :)
declare %private variable $app:global-subjects-repositories-collection := $app:default-repositories-collection || "subjects/";
declare variable $app:global-subjects-repositories-configuration := <repository name="Subjects EXC" authority="local" source="EXC" icon="local"/>;

(: materials :)
declare %private variable $app:global-materials-repositories-collection := $app:default-repositories-collection || "materials/";
declare variable $app:global-materials-repositories-configuration := <repository name="Materials EXC" authority="local" source="EXC" icon="local"/>;

(: styleperiods :)
declare %private variable $app:global-styleperiods-repositories-collection := $app:default-repositories-collection || "styleperiods/";
declare variable $app:global-styleperiods-repositories-configuration := <repository name="Styleperiods EXC" authority="local" source="EXC" icon="local"/>;

(: Techniques :)
declare %private variable $app:global-techniques-repositories-collection := $app:default-repositories-collection || "techniques/";
declare variable $app:global-techniques-repositories-configuration := <repository name="Techniques EXC" authority="local" source="EXC" icon="local"/>;

(: Worktypes :)
declare %private variable $app:global-worktypes-repositories-collection := $app:default-repositories-collection || "worktypes/";
declare variable $app:global-worktypes-repositories-configuration := <repository name="Worktypes EXC" authority="local" source="EXC" icon="local"/>;

declare variable $app:aat-facets := map {
    "materials" := "M.MT, V.TH",
    "styleperiods" := "F.FL",
    "techniques" := "K.KT",
    "worktypes" := "V"
};

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

(: "Mirrors" : viaf, getty :)
declare %private variable $app:global-mirrors-repositories-collection := $app:repositories-collection || "global/externalmirrors/";

(: viaf :)
declare %private variable $app:global-viaf-repositories-collection := $app:global-mirrors-repositories-collection || "viaf-small/";

(: rdf data :)
declare variable $app:global-viaf-rdf-repositories := $app:global-viaf-repositories-collection || 'rdf/';
(: xml data :)
declare variable $app:global-viaf-xml-repositories := $app:global-viaf-repositories-collection || 'xml/';

(: getty :)
declare %private variable $app:global-getty-repositories-collection := $app:global-mirrors-repositories-collection || "getty/";
(: getty subcollections :)
declare %private variable $app:global-getty-ulan-repositories := $app:global-getty-repositories-collection || "ulan/";
declare %private variable $app:global-getty-aat-repositories := $app:global-getty-repositories-collection || "aat/";
declare %private variable $app:global-getty-tgn-repositories := $app:global-getty-repositories-collection || "tgn/";

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

(: Users and Groups repositories :)
(: Configuration file for custom repositories :)
declare variable $app:repositories-configuration :=  '/repository.xml';

(: Fallback configuration for custom repositories :)
declare variable $app:global-default-repositories-configuration := <repository name="Unnamed Repo" authority="---" source="---" icon="unnamed"/>;

(: User :)
declare variable $app:users-repositories-collection := $app:repositories-collection || "local/users/";

(: Groups :)
declare variable $app:groups-repositories-collection := $app:repositories-collection || "local/groups/";


(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: ziziphus :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
declare %private variable $app:ziziphus-collection-name as xs:string := "Priya Paul Collection";
declare variable $app:ziziphus-resources-dir as xs:string := $app:ziziphus-dir || "/resources/";
declare variable $app:ziziphus-default-record-dir as xs:string := $app:common-data-dir || $app:ziziphus-collection-name || "/";


(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: shared :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
declare variable $app:code-tables as xs:string := $app:shared-dir || "/modules/edit/code-tables/";
declare variable $app:legends as xs:string := $app:shared-dir || "/modules/edit/code-tables/legends/";

(: ------------------------------------------------------------------------------------------------------------------------------------------ :)
(: tamboti :)
(: ------------------------------------------------------------------------------------------------------------------------------------------ :)

declare variable $app:dba-credentials := app:get-dba-credentials();

declare %private function app:get-dba-credentials() {
    let $config-ns := xs:anyURI("http://exist-db.org/mods/config")
    let $config-path := xs:anyURI('/apps/tamboti/modules/config.xqm ')
    return
        try {
            let $import := util:import-module($config-ns, "config", $config-path)
            return $config:dba-credentials
        } catch * {
            ("admin","")
        }
};

declare function app:get-resource($uuid) {
    let $security-ns := xs:anyURI("http://exist-db.org/mods/security")
    let $security-path := xs:anyURI('/apps/tamboti/modules/search/security.xqm')
    return
        try {
            let $import := util:import-module($security-ns, "security", $security-path)
            return
                util:eval("security:get-resource('" || $uuid || "')")
        } catch * {
            try {
            let $security-path := xs:anyURI('/apps/rosids-shared/modules/search/security.xqm')
            let $import := util:import-module($security-ns, "security", $security-path)
            return
                util:eval("security:get-resource('" || $uuid || "')")
            } catch * {
                "Catched Error: " ||  $err:code || ": " || $err:description
            }
        }
};