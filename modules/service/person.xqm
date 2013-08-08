xquery version "3.0";
(:
    Person search module
:)

module namespace person="http://exist-db.org/xquery/biblio/service/person";

import module namespace search="http://exist-db.org/xquery/biblio/service/search" at "search.xqm";
import module namespace ngram="http://exist-db.org/xquery/ngram";


(: TEI namesspace :)
declare namespace tei = "http://www.tei-c.org/ns/1.0";

(: Sample :)
(:
<person xml:id="uuid-f4ad4309-dff6-5ac0-9256-d65578112295">
    <persName xml:lang="eng">
        <forename>Zedong</forename>
        <surname>Mao</surname>
    </persName>
    <persName xml:lang="eng" ref="https://kjc-fs1.kjc.uni-heidelberg.de/ULANService/api/get.xml/500322044" type="preferred">
        <forename>Zedong</forename>
        <surname>Mao</surname>
    </persName>
    <persName xml:lang="eng" ref="http://viaf.org/viaf/51699962">
        <forename>Zedong</forename>
        <surname>Mao</surname>
    </persName>
    <persName xml:lang="ger" ref="http://d-nb.info/gnd/118577425">
        <forename>Zedong</forename>
        <surname>Mao</surname>
    </persName>
    <persName xml:lang="chi">毛泽东</persName>
    <persName xml:lang="ger">MaoTsetung</persName>
    <persName xml:lang="ger">MaoTse-tung</persName>
    <persName xml:lang="chi">毛澤東</persName>
    <persName xml:lang="chi">Mao Zedong</persName>
    <note>
        <p>Heidicon-SW-ID of Mao, Zedong: 394</p>
    </note>
    <note type="type">person</note>
</person>
:)

declare function person:createResults($query as xs:string, $results as item()*) {
    (:
    {
    // Query is not required as of version 1.2.5
    query: "Unit",
    suggestions: [
        { value: "United Arab Emirates", data: "AE" },
        { value: "United Kingdom",       data: "UK" },
        { value: "United States",        data: "US" }
    ]
}

:)
    
    
    <results>
        <query>{$query}</query>
        {
            for $result in $results
            let $persName := if (exists($result/tei:persName[@type eq "preferred"])) then ($result/tei:persName[@type eq "preferred"]) else ($result/tei:persName[1])
            return 
                if (exists($persName/tei:forename) or exists($persName/tei:surname))
                then (
                    let $person := $persName/tei:forename/text() || " " || $persName/tei:surname
                    return
                        <suggestions value="{$person}" data="{$person}"/>
                ) else (
                    let $person := $persName/text()
                    return
                      <suggestions value="{$person}" data="{$person}"/>
                )
        }
        <suggestions value="" data=""/>
    </results>
};

declare function person:lookup($query as xs:string) {
    let $results :=  collection("/resources/vocab/")//tei:listPerson/tei:person[ngram:contains(tei:persName, $query)]
    return
    if ($results) then (person:createResults($query, $results)) else (
        <results>
            <query>{$query}</query>
            <suggestions value="none" data="none"/>
        </results>
    )
};



