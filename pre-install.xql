xquery version "3.0";


import module namespace xmldb="http://exist-db.org/xquery/xmldb";

(: The following external variables are set by the repo:deploy function :)
(: file path pointing to the exist installation directory :)
declare variable $home external;
(: path to the directory containing the unpacked .xar package :)
declare variable $dir external;
(: the target collection into which the app is deployed :)
declare variable $target external;

declare variable $db-root := "/db";
declare  variable $data-dir := "resources/";
declare  variable $vocab-dir := $data-dir || "vocab/";

declare variable $log-level := "INFO";

declare variable $biblio-admin-user := "editor";
declare variable $biblio-users-group := "biblio.users";

declare function local:set-collection-resource-permissions($collection as xs:string, $owner as xs:string, $group as xs:string, $permissions as xs:int) {
    if(xmldb:collection-available($collection))
    then (
        let $resources :=
            for $resource in xmldb:get-child-resources($collection)
                return
                    xmldb:set-resource-permissions($collection, $resource, $owner, $group, $permissions)
        let $collections :=
            for $child-collection in  xmldb:get-child-collections($collection)
                         let $permission := xmldb:set-collection-permissions($collection || "/" || $child-collection, $owner, $group, $permissions)
                         return
                                 local:set-collection-resource-permissions($collection || "/" || $child-collection, $owner, $group, $permissions)
         return ()
    ) else ()
};

declare function local:mkcol-recursive($collection, $components) {
    if (exists($components)) then
        let $newColl := concat($collection, "/", $components[1])
        return (
            xmldb:create-collection($collection, $components[1]),
            local:mkcol-recursive($newColl, subsequence($components, 2))
        )
    else
        ()
};

(: Helper function to recursively create a collection hierarchy. :)
declare function local:mkcol($collection, $path) {
    local:mkcol-recursive($collection, tokenize($path, "/"))
};


util:log($log-level, "Script: Running pre-install script ..."),
util:log($log-level, "DIR: " || $dir),

local:mkcol($db-root, $vocab-dir),
xmldb:store-files-from-pattern( $vocab-dir, $dir, "data/vocab/*.xml"),
local:set-collection-resource-permissions($db-root || "/" ||   $vocab-dir, $biblio-admin-user, $biblio-users-group, util:base-to-integer(0755, 8)),


local:mkcol("/db/system/config/db", $vocab-dir),
xmldb:store-files-from-pattern(concat("/system/config/db/",$vocab-dir), $dir, "data/vocab/*.xconf") ,

util:log($log-level, "...DONE")