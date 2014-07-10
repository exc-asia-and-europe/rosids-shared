xquery version "3.0";

import module namespace app="http://exist-db.org/xquery/biblio/shared/app" at "app.xqm";
import module namespace security="http://exist-db.org/mods/security" at "../search/security.xqm";

declare variable $user := security:get-user-credential-from-session()[1];
declare variable $userpass := security:get-user-credential-from-session()[2];

(:
    let $user := replace(request:get-parameter("user", ""), "[^0-9a-zA-ZäöüßÄÖÜ\-,. ]", "")
    let $group := replace(request:get-parameter("user", ""), "[^0-9a-zA-ZäöüßÄÖÜ\-,. ]", "")
:)

declare %private function local:getGlobalCollection($type as xs:string) {
    let $name := 
        switch ($type)
            case "names"
            case "organisations"
            case "persons"
                return 'EXC/VIAF'
            case "subjects"
                return 'EXC/AAT'
            default 
                return 'Unknown'
    return
        <repository repotype="global" termtype="{$type}" name="{$name}" collection="default"/>
};

declare %private function local:getUserCollection($user as xs:string, $type as xs:string) {
    let $collection := $app:users-repositories-collection || $user || '/' || $type
    return
            if ( xmldb:collection-available($collection) and count(xmldb:get-child-resources($collection)) > 0)
            then <repository repotype="user" termtype="{$type}" name="{$user}" collection="{$collection}"/>
            else ()
};

declare %private function local:getGroupCollections($group as xs:string, $type as xs:string) {
    let $collection := $app:groups-repositories-collection || $group || '/' || $type || '/'
    let $log1 := util:log('info','colection: ' || $collection)
    return
        if (xmldb:collection-available($collection) and count(xmldb:get-child-resources($collection)) > 0)
        then <repository repotype="group" termtype="{$type}" name="{$group}" collection="{$collection}"/>
        else () 
};

declare %private function local:getRepositories($user as xs:string, $groups as xs:string*, $type as xs:string) {
    let $global := local:getGlobalCollection($type)
    let $local := ( local:getUserCollection($user, $type), for $group in $groups
        return 
            local:getGroupCollections($group, $type) )
    return
    <repositories>
    {
        $global,
        if(count($local) > 0) then (<repository repotype="global" termtype="{$type}" name="Use custom vocab" collection="local"/>, $local) else ()
    }
    </repositories>
};

let $type := replace(request:get-parameter("type", "subjects"), "[^0-9a-zA-ZäöüßÄÖÜ\-,. ]", "")
let $log1 := util:log('info','user: ' || $user)
let $log1 := util:log('info','userpass: ' || $userpass)
let $groups := system:as-user($user, $userpass, ( sm:get-user-groups($user) ) )
return
    <data>
        <global/>
        <custom/>
        {local:getRepositories($user, $groups, $type)}
    </data>
