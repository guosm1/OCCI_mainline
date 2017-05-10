Name:           occi 
Version:        1.0.0.0
Release:        2
Vendor:         AsiaInfo, Inc.
URL:            http://www.asiainfo.com
Packager:       AsiaInfo, Inc.<For more information, please contact your sales representative>
Summary:        OCCI service installation package. 
Group:          Applications/System
License:        Copyright AsiaInfo, Inc. 2016
Source0:        %{name}-%{version}.tar.gz
BuildArch:      x86_64 
Requires:       ambari-server >= 2.2.1.1
%define         userpath  /var/lib/ambari-server/resources/stacks/HDP/current/services
%define         stackpath /var/lib/ambari-server/resources/stacks/HDP
%define         jspath    /usr/lib/ambari-server/web/javascripts
Prefix:         %{userpath}
%define         _topdir %(echo $PWD)/dist
%description 
OCCI service installation package.

%pre
ambari_version=`rpm -q ambari-server|awk -F '-' '{print $3}'`
if [ $ambari_version = '2.2.1.1' ]
then
    ln -s %{stackpath}/2.4 %{stackpath}/current
elif [ $ambari_version = '2.4.0.1' ]
then
    ln -s %{stackpath}/2.5 %{stackpath}/current
else
    ln -s %{stackpath}/2.6 %{stackpath}/current
fi
%post
ambari_version=`rpm -q ambari-server|awk -F '-' '{print $3}'`
if [ $ambari_version = '2.2.1.1' ]
then
    mv -f %{jspath}/app.js.gz %{jspath}/app.js.gz.bak
    cp -f %{userpath}/OCCI/appjs/2.2.1.1/app.js.gz %{jspath}
    sed -i 's/{hdp_version}/2.4/g' %{userpath}/OCCI/alerts.json
fi
if [ $ambari_version = '2.4.0.1' ]
then
    mv -f %{jspath}/app.js %{jspath}/app.js.bak
    cp -f %{userpath}/OCCI/appjs/2.4.0.1/app.js %{jspath}
    sed -i 's/{hdp_version}/2.5/g' %{userpath}/OCCI/alerts.json
fi
if [ $ambari_version = '2.5.0.3' ]
then
    mv -f %{jspath}/app.js %{jspath}/app.js.bak
    cp -f %{userpath}/OCCI/appjs/2.5.0.3/app.js %{jspath}
    sed -i 's/{hdp_version}/2.6/g' %{userpath}/OCCI/alerts.json
fi

%postun
rm -f %{stackpath}/current
ambari_version=`rpm -q ambari-server|awk -F '-' '{print $3}'`
if [ $ambari_version = '2.2.1.1' ]
then
mv -f %{jspath}/app.js.gz.bak %{jspath}/app.js.gz
fi
if [ $ambari_version = '2.4.0.1' ]
then
mv -f %{jspath}/app.js.bak %{jspath}/app.js
fi
if [ $ambari_version = '2.5.0.3' ]
then
mv -f %{jspath}/app.js.bak %{jspath}/app.js
fi

%prep
%setup -c
%install
install -d $RPM_BUILD_ROOT%{userpath}
cp -a * $RPM_BUILD_ROOT%{userpath}
exit 0
%clean
rm -rf $RPM_BUILD_ROOT
rm -rf $RPM_BUILD_DIR/%{name}-%{version}
%files
%defattr(-,root,root)
%{userpath}

%changelog
* Tue May 09 2017  Zhao Yi Ming <zhaoym6@asiainfo.com>
- integrate with occi knowledge base alert links
- support OCDP4.2
* Fri Apr 14 2017  Guo Qian <guoqian3@asiainfo.com> 1.0.0.0-2
- support both OCDP4.0 and OCDP4.1
* Mon Jan 22 2017  Guo Qian <guoqian3@asiainfo.com> 1.0.0.0-1
- Initial
- support OCDP4.1